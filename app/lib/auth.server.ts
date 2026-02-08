import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { username } from "better-auth/plugins";
import { API_BASE, APP_BASE } from "./utils/env.server";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: new Database(`${__dirname}/db/auth.db`),
    secondaryStorage: {
        get: async (key) => {
            const res = await fetch(
                `${API_BASE}/user_session/${key}`,
            );
            if (!res.ok) return null;
            const data = await res.json();
            return data;
        },
        set: async (key, value, ttl) => {
            await fetch(`${API_BASE}/user_session/${key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value, ttl }),
            });
        },
        delete: async (key) => {
            await fetch(`${API_BASE}/user_session/${key}`, {
                method: "DELETE",
            });
        },
    },
    plugins: [
        username(),
    ],
    session: {
        storeSessionInDatabase: false,
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: (new URL(API_BASE)).hostname,
        },
    },
    trustedOrigins: [
        API_BASE,
        APP_BASE,
    ],
});
