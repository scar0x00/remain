import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock, AtSign, UserPlus, PanelRight } from "lucide-react";
import { authClient } from "~/lib/utils/authClient";
import { cn } from "~/lib/utils";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: signUpError } = await authClient.signUp.email({
            email,
            password,
            name,
            username,
        }, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onError: (ctx) => setError(ctx.error.message || "An error occurred during signup"),
            onSuccess: () => navigate("/"),
        });

        if (signUpError) {
            setLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <div className="mt-8 px-4 max-w-sm mx-auto">
=======
        <div className="mt-2 px-4 max-w-sm mx-auto">
>>>>>>> dev
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-2xl font-bold text-gray-400">Sign Up</h1>
                <PanelRight className="text-gray-400" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4 text-center">
                {error && (
                    <div className="text-sm text-red-500 mb-4 px-1">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 px-1 flex items-center gap-2">
                        <User size={14} /> Name
                    </label>
                    <input
                        type="text"
                        required
                        className="text-base border-2 py-2 px-3 rounded-md border-gray-200 transition-colors focus:outline-none focus:border-gray-400 w-full text-gray-700"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 px-1 flex items-center gap-2">
                        <AtSign size={14} /> Username
                    </label>
                    <input
                        type="text"
                        required
                        className="text-base border-2 py-2 px-3 rounded-md border-gray-200 transition-colors focus:outline-none focus:border-gray-400 w-full text-gray-700"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                    />
                </div>

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
                            `bg-gray-800 text-white py-3 px-6 rounded-md mt-6 transition-colors font-medium
                            flex items-center justify-center gap-2 hover:bg-gray-900 text-center`,
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <UserPlus size={18} />
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 font-light">
                    Already have an account?{" "}
                    <Link to="/login" className="underline hover:text-gray-600 transition-colors font-normal">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
