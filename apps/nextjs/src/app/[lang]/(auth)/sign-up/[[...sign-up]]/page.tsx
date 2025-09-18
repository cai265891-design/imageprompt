import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - ImagePrompt",
  description: "Create your ImagePrompt account",
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            formButtonPrimary:
              "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
            socialButtonsBlockButton:
              "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            socialButtonsBlockButtonText: "font-medium",
            formFieldLabel: "text-gray-700 dark:text-gray-300",
            formFieldInput:
              "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
            footerActionLink:
              "text-purple-600 hover:text-purple-700 font-medium",
          },
          layout: {
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "top",
          },
          variables: {
            colorPrimary: "#7f00ff",
            colorText: "#1f2937",
            borderRadius: "0.5rem",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/image-prompt"
      />
    </div>
  );
}
