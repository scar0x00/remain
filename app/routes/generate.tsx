import { useFetcher } from "react-router";
import { Paperclip, SendHorizontal } from "lucide-react";
import type { Route } from "./+types/generate";
import { ChatHistory } from "~/lib/my-components/ChatHistory";
import { chatHistoryAtom } from "~/lib/state/chatHistory";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { getAgentCompletion } from "~/lib/agents/deckGenerationAgent";

export async function loader({ }: Route.LoaderArgs) {
    return {};
}

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();
    console.log(formData);
    const userMessage = formData.get('user-message')
    if (typeof userMessage !== "string") throw "Unexpected error";
    if (userMessage === undefined) throw "Unexpected error";

    const response = await getAgentCompletion({
        userMessage: userMessage,
        threadId: "654321",
        userId: "654321"
    });
    return {
        role: "agent",
        content: response.structuredResponse.summary,
    };
}

export default function Generate({
    loaderData,
}: Route.ComponentProps) {
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
    const fetcher = useFetcher();
    useEffect(() => {
        if (fetcher.data !== undefined) {
            // console.log(fetcher.data);
            setChatHistory((chat) => [
                ...chat,
                fetcher.data
            ]);
        }
    }, [fetcher.data]);


    return (
        <div className="h-screen w-screen lg:px-96 flex flex-col justify-between">
            <div className="w-full h-2/3 pt-12">
                <ChatHistory messages={chatHistory} />
            </div>
            <div className="pb-12 w-full flex flex-col items-center">
                <fetcher.Form className="md:w-4/5 flex flex-col items-stretch" method="post">
                    <textarea className="resize-none w-full border-2 border-b-transparent h-24 p-4  focus:outline-none focus:ring-0 rounded-t-md
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb:neutral-700/40
                        hover:scrollbar-thumb:neutral-500/70
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-neutral-600/50
                        [&::-webkit-scrollbar-thumb]:rounded-xl
                        hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/80
                        transition-colors"
                        name="user-message"
                        id="user-message-field"
                        disabled={fetcher.state === "loading"}></textarea>
                    <div className="grid grid-cols-2 grid-rows-1 gap-3 py-2 border-2 border-t-transparent px-2 rounded-b-md">
                        <button className="justify-self-start p-1.5 border-2 border-gray-400 rounded-full hover:cursor-pointer">
                            <Paperclip size={18} strokeWidth={1.5} className="text-gray-400" />
                        </button>
                        <button
                            className="justify-self-end place-self-end p-1.5 border-2 border-gray-400 rounded-full hover:cursor-pointer"
                            onClick={(e) => {
                                const form = e.currentTarget.form;
                                const textarea = form?.elements.namedItem('user-message') as HTMLTextAreaElement;
                                const content = textarea?.value || '';
                                setChatHistory((chat) => [
                                    ...chat,
                                    {
                                        role: "user",
                                        content: content
                                    }
                                ]);
                                if (form) {
                                    fetcher.submit(form);
                                }
                            }}
                            type="submit" disabled={fetcher.state === "loading"}
                        >
                            <SendHorizontal size={18} strokeWidth={1.5} className="text-gray-400" />
                        </button>
                    </div>
                    <input type="hidden" name="chatUUID" value={"hi"} />
                </fetcher.Form>
            </div>
        </div>
    );
}