import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** Enables passing the custom `role` field defined in the server config. */
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
