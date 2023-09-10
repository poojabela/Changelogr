import type { User } from "@prisma/client";

import { Authenticator } from "remix-auth";
import { OTPStrategy } from "remix-auth-otp";
import { sessionStorage } from "./session.server";

import { db } from "~/utils/db.server";
import { sendEmail } from "./email.server";
import { createUserEmail } from "./user.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new OTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET || "STRONG_SECRET",

      // Magic generation.
      magicLinkGeneration: {
        callbackPath: "/auth/magic",
      },

      // Store code in database.
      storeCode: async (code) => {
        await db.otp.create({
          data: {
            code: code,
            active: true,
            attempts: 0,
          },
        });
      },

      // Send code to user.
      sendCode: async ({ email, code, magicLink }) => {
        // Call provider sender email function.
        await sendEmail({ to: email, magicLink, code });
      },

      // Validate code.
      validateCode: async (code) => {
        const otp = await db.otp.findUnique({
          where: { code: code },
        });
        if (!otp) throw new Error("Code not found.");

        return {
          code: otp.code,
          active: otp.active,
          attempts: otp.attempts,
        };
      },

      // Invalidate code.
      invalidateCode: async (code, active, attempts) => {
        await db.otp.update({
          where: {
            code: code,
          },
          data: {
            active: active,
            attempts: attempts,
          },
        });
      },
    },
    async ({ email }) => {
      // Get user from database.
      let user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        user = await createUserEmail({ email });
        if (!user) throw new Error("Unable to create user.");
      }

      // Return user as Session.
      return user;
    },
  ),
);
