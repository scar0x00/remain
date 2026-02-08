import { Hono } from "hono";
import { studySession } from "./study_session";
import { userSessions } from "./user_sessions";
import { deck, listDecksHandler } from "./deck";
import { authMiddleware } from "./auth";
import { cors } from "hono/cors";
import { D1Database, KVNamespace, R2Bucket } from "@cloudflare/workers-types";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  displayUsername: string;
};

export type Session = {
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Variables = {
  user: User;
  session: Session;
};

export type Bindings = {
  DECK_BUCKET: R2Bucket;
  DECKS_DB: D1Database;
  REMAIN_SESSIONS: KVNamespace;
  BETTER_AUTH_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", cors({
  origin: (origin, c) => c.env.APP_BASE,
  credentials: true
}));


app.use("/decks", authMiddleware);
app.use("/api/v1/decks", authMiddleware);
app.on(
  "GET",
  ["/decks", "/api/v1/decks"],
  listDecksHandler
);

app.route("deck", deck);
app.route("api/v1/deck", deck);

app.route("/study_session", studySession);
app.route("api/v1/study_session", studySession);

app.route("/user_session", userSessions);
app.route("api/v1/user_session", userSessions);

export default app;
