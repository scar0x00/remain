import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, LogIn, PanelRight } from "lucide-react";
import { authClient } from "~/lib/utils/authClient";
import { cn } from "~/lib/utils";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onError: (ctx) => setError(ctx.error.message || "Invalid email or password"),
            onSuccess: () => navigate("/decks"),
        });

        if (signInError) {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 px-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-2xl font-bold text-gray-400">Login</h1>
                <PanelRight className="text-gray-400" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4" id="login-form">
                {error && (
                    <div className="text-sm text-red-500 mb-4 px-1">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 px-1 flex items-center gap-2">
                        <Mail size={14} /> Email
                    </label>
                    <input
                        type="email"
                        required
                        className="text-base border-2 py-2 px-3 rounded-md border-gray-200 transition-colors focus:outline-none focus:border-gray-400 w-full text-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 px-1 flex items-center gap-2">
                        <Lock size={14} /> Password
                    </label>
                    <input
                        type="password"
                        required
                        className="text-base border-2 py-2 px-3 rounded-md border-gray-200 transition-colors focus:outline-none focus:border-gray-400 w-full text-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "bg-gray-800 text-white py-2.5 px-6 rounded-md mt-6 transition-colors font-medium flex items-center justify-center gap-2 hover:bg-gray-900",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <LogIn size={18} />
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 font-light">
                    Don't have an account?{" "}
                    <Link to="/signup" className="underline hover:text-gray-600 transition-colors font-normal">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
