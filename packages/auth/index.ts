import { getCurrentUser as getNextAuthUser } from "./nextauth";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export { authOptions } from "./nextauth";
export { getCurrentUser } from "./nextauth";
