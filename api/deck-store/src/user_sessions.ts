import { Hono } from "hono";
import { KVNamespace } from "@cloudflare/workers-types";

type Bindings = {
  REMAIN_SESSIONS: KVNamespace;
};

export const userSessions = new Hono<{ Bindings: Bindings }>();

userSessions.get("/:sessionid", async (c) => {
  const sessionid = c.req.param("sessionid");
  const session = await c.env.REMAIN_SESSIONS.get(sessionid);

  if (!session) {
    console.log("session not found");
    return c.json({
      error: "Session not found",
    }, 404);
  }
  return c.text(session);
});

userSessions.put("/:sessionid", async (c) => {
  const sessionid = c.req.param("sessionid");
  const body = await c.req.json();

  if (!body) {
    return c.json({
      error: "Empty body",
    }, 400);
  }

  await c.env.REMAIN_SESSIONS.put(
    sessionid,
    JSON.stringify(body.value),
    {
      expirationTtl: body.ttl,
    },
  );

  return c.json({
    error: null,
    success: true,
  });
});

userSessions.delete("/:sessionid", async (c) => {
  const sessionid = c.req.param("sessionid");

  await c.env.REMAIN_SESSIONS.delete(sessionid);

  return c.json({
    error: null,
    success: true,
  });
});
