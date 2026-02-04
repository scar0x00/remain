import { Hono } from "hono";
import { D1Database } from "@cloudflare/workers-types";

type Bindings = {
  DECKS_DB: D1Database;
};

const studySession = new Hono<{ Bindings: Bindings }>();

studySession.post(
  "/:deckid",
  async (c) => {
    const deckid = c.req.param("deckid");
    const {
      correct_count,
      incorrect_count,
      wrong_answers_indexes,
      session_id,
    } = await c.req.json();

    console.log(deckid, correct_count, incorrect_count, wrong_answers_indexes, session_id);

    const totalCards = (correct_count ?? 0) + (incorrect_count ?? 0);
    const sessionScore = totalCards > 0 ? ((correct_count ?? 0) * 100) / totalCards : 0;

    try {
      await c.env.DECKS_DB.batch([
        c.env.DECKS_DB.prepare(`
          INSERT INTO study_session (session_id, deckid, correct_count, incorrect_count, wrong_answers_indexes)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          session_id,
          deckid,
          correct_count ?? 0,
          incorrect_count ?? 0,
          wrong_answers_indexes ? JSON.stringify(wrong_answers_indexes) : "[]",
        ),
        c.env.DECKS_DB.prepare(`
          UPDATE deck 
          SET score = 
          CASE 
              WHEN score IS NULL THEN ? 
              ELSE (score + ?) / 2.0 
          END,
          last_session = datetime('now')
          WHERE deckid = ?
        `).bind(sessionScore, sessionScore, deckid)
      ]);

      return c.json({
        error: null,
        session_id,
      });
    } catch (e: any) {
      console.error(e);
      c.status(500);
      return c.json({
        error: e.message || "Failed to save study session",
      });
    }
  },
).get("/:deckid", async (c) => {
  const deckid = c.req.param("deckid");
  try {
    const { results } = await c.env.DECKS_DB.prepare(`
      SELECT * FROM study_session WHERE deckid = ? ORDER BY timestamp DESC
    `).bind(deckid).all();

    return c.json({
      error: null,
      sessions: results.map((r) => ({
        ...r,
        wrong_answers_indexes: r.wrong_answers_indexes
          ? JSON.parse(r.wrong_answers_indexes as string)
          : [],
      })),
    });
  } catch (e: any) {
    c.status(500);
    return c.json({
      error: e.message || "Failed to fetch study sessions",
    });
  }
});

export { studySession };
