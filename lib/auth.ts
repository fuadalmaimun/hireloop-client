import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { APIError, createAuthMiddleware } from "better-auth/api";

const client = new MongoClient(process.env.MONGO_DB_URI as string);
const db = client.db("hireloop");
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "seeker",
        input: true, 
      },
       premium: {
      type: "boolean",
      defaultValue: false,
      input: false,
    },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Role guard — `role` is client-settable only at sign-up, and only as
      // "seeker"/"recruiter". Every other write path is blocked here, so a
      // signed-in user can never promote themselves (e.g. to "admin")
      // through the API. Admins are provisioned by flipping the role in the
      // database directly.
      if (ctx.path === "/update-user") {
        if (ctx.body && typeof ctx.body === "object") {
          delete (ctx.body as Record<string, unknown>).role;
        }
        return;
      }

      if (ctx.path === "/sign-up/email") {
        const role = (ctx.body as Record<string, unknown> | undefined)?.role;

        if (role && role !== "seeker" && role !== "recruiter") {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid role",
          });
        }
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});



