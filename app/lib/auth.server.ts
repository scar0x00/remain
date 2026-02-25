import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { username } from "better-auth/plugins";
import { API_BASE, APP_BASE } from "./utils/env.server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

const __dirname = dirname(fileURLToPath(import.meta.url));

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 12,
        sendResetPassword: async ({ user, url, token }) => {
            await resend.emails.send({
                from: "No Reply <noreply@info.null0x00.click>",
                to: [user.email],
                subject: "[Remain] Password reset",
                html:
`Hi <strong>${user.name}</strong>!,
It seems like you want to reset your password.
Click <a href="${url}">here</a> to verify this email address
If you didnt request to reset your password ignore this email.`,
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {
            await resend.emails.send({
                from: "No Reply <noreply@info.null0x00.click>",
                to: [user.email],
                subject: "[Remain] Email verification",
                html:
                    `Please <strong>@${user.name}</strong>, click <a href="${url}">here</a> to verify this email address`,
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600, // 1 hour
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
