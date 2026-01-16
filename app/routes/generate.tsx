import { useFetcher, Outlet, redirect } from "react-router";
import { CirclePlus } from "lucide-react";
import type { Route } from "./+types/generate";

export async function loader({ params }: Route.LoaderArgs) {
    if (params.chatId === undefined) {
        return redirect(`/generate/${crypto.randomUUID()}`)
    }
    return {};
}

// export async function action({
//     request,
//     params
// }: Route.ActionArgs) {
//     let formData = await request.formData();
//     console.log(formData);
//     const userMessage = formData.get('user-message')
//     if (typeof userMessage !== "string") throw "Unexpected error";
//     if (userMessage === undefined) throw "Unexpected error";

//     if (params.chatId === undefined) {
//         return redirect(`/generate/${crypto.randomUUID()}`);
//     }

//     const response = await getAgentCompletion({
//         userMessage: userMessage,
//         threadId: params.chatId,
//         userId: "1"
//     });
//     return {
//         role: "agent",
//         content: response.structuredResponse.summary,
//     };
// }

export default function Generate({ }: Route.ComponentProps) {
    return (
        <div className="grid grid-rows-1 grid-cols-5 h-screen w-screen" id="main-container">
            <div className="col-start-1 flex flex-col justify-start items-stretch px-3 pt-8 bg-gray-50 rounded-r-sm *:mt-3" id="sidebar">
                <h1 className="self-start text-xl">Remain</h1>
                <div className="">
                    <button className="p-2 text-sm text-gray-600 hover:cursor-pointer hover:text-black rounded-md bg-gray-200">
                        <a href="/generate">
                            New chat &nbsp;<CirclePlus className="inline" size={20} />
                        </a>
                    </button>
                </div>
            </div>
            <div className="col-start-2 col-span-3 px-20 flex flex-col justify-between">
                <Outlet />
            </div>
            <div className="-col-start-2 px-20 flex flex-col justify-between bg-gray-50 rounded-l-md">

            </div>
        </div>
    );
}