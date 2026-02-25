import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
<<<<<<< HEAD
import { APP_BASE } from "./env.server";


export const authClient = createAuthClient({
    baseURL: APP_BASE,
    plugins: [
        usernameClient()
    ]
});

// export const { signIn, signUp, useSession } = createAuthClient();
=======


export const authClient = createAuthClient({
    baseURL: "http://192.168.1.108:5173",
    plugins: [
        usernameClient()
    ]
});
>>>>>>> dev
