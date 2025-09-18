import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

import { db } from "@saasfly/db";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`Webhook with type of ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

    const email = email_addresses?.[0]?.email_address;
    const name = first_name ? `${first_name} ${last_name || ""}`.trim() : username || "";

    try {
      // Check if user exists by ID (more reliable than email)
      const existingUser = await db
        .selectFrom("User")
        .select("id")
        .where("id", "=", id)
        .executeTakeFirst();

      if (existingUser) {
        // Update existing user
        await db
          .updateTable("User")
          .set({
            email: email || null,
            name: name || null,
            image: image_url || null,
            emailVerified: new Date(),
          })
          .where("id", "=", id)
          .execute();

        console.log(`Updated user: ${email}`);
      } else {
        // Create new user (this handles both user.created and user.updated for missing users)
        await db
          .insertInto("User")
          .values({
            id: id, // Use Clerk's user ID as the primary key
            email: email || null,
            name: name || null,
            image: image_url || null,
            emailVerified: new Date(),
          })
          .execute();

        console.log(`Created new user: ${email}`);

        // Check if Customer record exists
        const existingCustomer = await db
          .selectFrom("Customer")
          .select("id")
          .where("authUserId", "=", id)
          .executeTakeFirst();

        if (!existingCustomer) {
          // Create a Customer record for the new user
          await db
            .insertInto("Customer")
            .values({
              authUserId: id,
              name: name || null,
              plan: "FREE",
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .execute();

          console.log(`Created customer record for user: ${email}`);
        }
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete user from database
      await db
        .deleteFrom("User")
        .where("id", "=", id)
        .execute();

      // Also delete related Customer record
      await db
        .deleteFrom("Customer")
        .where("authUserId", "=", id)
        .execute();

      console.log(`Deleted user with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting user from database:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}