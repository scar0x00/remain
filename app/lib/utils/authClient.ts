import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
    baseURL: "http://192.168.1.108:5173",
    plugins: [
        usernameClient()
    ]
});