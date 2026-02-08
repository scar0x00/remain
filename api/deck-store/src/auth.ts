// worker/auth.ts
import { betterAuth } from "better-auth";
import type { Bindings } from "./index";
import type { Context, MiddlewareHandler } from "hono";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = (
  env: Bindings,
) => {
  if (authInstance) return authInstance;

  authInstance = betterAuth({
    secret: env.BETTER_AUTH_SECRET,

    secondaryStorage: {
      get: async (key) => {
        const val = await env.REMAIN_SESSIONS.get(key);
        return val ? JSON.parse(val) : null;
      },
      set: async () => {
        throw new Error("Worker is Read-Only");
      },
      delete: async () => {
        throw new Error("Worker is Read-Only");
      },
    },

    session: {
      storeSessionInDatabase: false,
      cookieCache: {
        maxAge: 5 * 60, // 5 minutes (short-lived cookie)
        refreshCache: false, // Disable stateless refresh
      },
    },
  });

  return authInstance;
};

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c.env);

  // console.log("headers", c.req.raw.headers);

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // console.log("setting var", session);

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
};
