import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
import { APP_BASE } from "./env.server";


export const authClient = createAuthClient({
    baseURL: APP_BASE,
    plugins: [
        usernameClient()
    ]
});

// export const { signIn, signUp, useSession } = createAuthClient();