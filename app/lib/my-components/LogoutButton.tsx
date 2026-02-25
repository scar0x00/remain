import { LogOut } from "lucide-react";
import { authClient } from "~/lib/utils/authClient";
import { cn } from "~/lib/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router";


export function LogoutButton({
    className
}: {
    className: string
}) {
    const navigate = useNavigate();
    const clickHandler = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        const token = (await authClient.getSession()).data?.session.token;
        if (!token) {
            navigate("/login");
            return;
        }
        authClient.revokeSession({
            token
        });
        navigate("/login");
    }, []);

    return (
        <button className={cn(
            `rounded-md px-4 py-2 bg-gray-700 text-gray-100`,
            className
        )} onClick={clickHandler}>
            <LogOut className="inline" size={16} /> Log out
        </button>
    )
}