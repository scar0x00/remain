import { redirect } from "react-router";
import { auth } from "~/lib/auth.server";

export async function requireSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    console.log("no session found");
    throw redirect("/login");
  }
  return session.user;
}
