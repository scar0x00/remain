import { Context, Hono } from "hono";
import type { Bindings, Variables } from "./index";
import { authMiddleware } from "./auth";

const deck = new Hono<{ Bindings: Bindings; Variables: Variables }>();

deck.use(authMiddleware);

deck.get("/:deckid", async (c) => {
    const object = await c.env.DECK_BUCKET.get(c.req.param("deckid"));
    const content = await object?.json();
    if (content !== undefined) return c.json(content);

    return c.json([]);
}).put(async (c) => {
    const body = await c.req.json();
    const deckid = c.req.param("deckid");

    if (body == "") {
        c.status(400);
        return c.json({
            error: "File not found",
        });
    }

    const length = body.cards?.length || 0;

    await c.env.DECKS_DB.prepare(`
  INSERT INTO deck (deckid, title, length, owner_id)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(deckid) DO UPDATE SET
    title = excluded.title,
    length = excluded.length,
    updated = datetime('now')
  `).bind(deckid, body.title, length, c.var.user.id).run();

    await c.env.DECK_BUCKET.put(
        deckid,
        JSON.stringify(body),
        {
            customMetadata: {
                title: body.title,
                length: length,
                owner_id: c.var.user.id
            },
        },
    );

    return c.json({
        error: null,
        url: `/deck/${deckid}`,
    });
}).delete(async (c) => {
    const hard = c.req.query("hard");
    try {
        if (hard === "true") {
            await c.env.DECK_BUCKET.delete(c.req.param("deckid"));
            await c.env.DECKS_DB.prepare(`
      DELETE FROM deck WHERE deckid = ?
    `).bind(c.req.param("deckid")).run();
        } else {
            await c.env.DECKS_DB.prepare(`
        UPDATE deck 
        SET delete_date = datetime('now'),
            updated = datetime('now')
        WHERE deckid = ? AND delete_date IS NULL
      `).bind(c.req.param("deckid")).run();
        }

        return c.json({
            error: null,
        });
    } catch (e) {
        return c.json({
            error: e,
        });
    }
});

const listDecksHandler = async (
    c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
    try {
        const { results } = await c.env.DECKS_DB.prepare(`
      SELECT deckid, title, length, created, last_session, score
      FROM deck
      WHERE delete_date IS NULL AND owner_id = ?
      ORDER BY created DESC
      LIMIT 15
    `).bind(c.var.user.id).all();

        return c.json({
            error: null,
            decks: results.map((deck: any) => ({
                key: deck.deckid,
                uploaded: deck.created,
                title: deck.title,
                length: deck.length,
                last_session: deck.last_session,
                score: deck.score,
            })),
        });
    } catch (e: any) {
        console.error("Error listing decks:", e);
        return c.json({
            error: e.message || "Failed to list decks",
            decks: [],
        });
    }
};

export { deck, listDecksHandler };
