import { Hono } from "hono";
// import { cors } from "hono/cors";
import { R2Bucket } from "@cloudflare/workers-types";

type Bindings = {
  DECK_BUCKET: R2Bucket;
};

const deck = new Hono<{ Bindings: Bindings }>();
const app = new Hono<{ Bindings: Bindings }>();

// app.use("*", cors());

deck.get("/:deckid", async (c) => {
  const object = await c.env.DECK_BUCKET.get(c.req.param("deckid"));
  const content = await object?.json();
  if (content !== undefined) return c.json(content);

  return c.json([]);

}).put(async (c) => {
  const body = await c.req.text();

  if (body == "") {
    c.status(400);
    return c.json({
      error: "File not found",
    });
  }

  await c.env.DECK_BUCKET.put(
    c.req.param("deckid"),
    body,
  );

  return c.json({
    error: null,
    url: `/deck/${c.req.param("deckid")}`,
  });


}).delete(async (c) => {
  try {
    await c.env.DECK_BUCKET.delete(c.req.param("deckid"));
    return c.json({
      error: null,
    });
  } catch (e) {
    return c.json({
      error: e,
    });
  }
});



app.route("deck", deck);

app.get("/decks", async (c) => {
  const decks = await c.env.DECK_BUCKET.list({
    limit: 15,
  });

  return c.json({
    error: null,
    decks: decks.objects
  });
});

export default app;
