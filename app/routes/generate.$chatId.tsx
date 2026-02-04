import { useFetcher } from "react-router";
import { Paperclip, SendHorizontal, File } from "lucide-react";
import type { Route } from "./+types/generate.$chatId";
import { ChatHistory } from "~/lib/my-components/ChatHistory";
import { chatHistoryAtom } from "~/lib/state/chatHistory";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { getAgentCompletion } from "~/lib/agents/deckGenerationAgent";
import { deckDraftAtom } from "~/lib/state/deckDraft";
import clsx from "clsx";



export async function action({
    request,
    params
}: Route.ActionArgs) {
    let formData = await request.formData();
    let fileContent: string | undefined = undefined;
    if (formData.get("knowledge-source")) {
        const file = formData.get("knowledge-source") as File;
        fileContent = await file.text();
    }
    const userMessage = formData.get('user-message')
    if (typeof userMessage !== "string") throw "Unexpected error";
    if (userMessage === undefined) throw "Unexpected error";
    if (params.chatId === undefined) throw "Chat ID is empty"

    let message = "";
    if (fileContent !== undefined) {
        message = JSON.stringify({
            userMessage,
            fileContent
        })
    } else {
        message = userMessage
    }

    const response = await getAgentCompletion({
        userMessage: message,
        threadId: params.chatId,
        userId: "1"
    });
    return {
        role: "agent",
        content: response.structuredResponse,
    };
}

export default function GenerateChatId({
    loaderData,
    params
}: Route.ComponentProps) {
    const [prompt, setPrompt] = useState("");
    const [fileName, setFileName] = useState("");
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
    const setDeckDraft = useSetAtom(deckDraftAtom);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fetcher = useFetcher();

    useEffect(() => {
        // console.log(chatHistory);
        if (fetcher.data !== undefined) {
            if (fileInputRef.current !== null) {
                fileInputRef.current.value = '';
            }
            if (fetcher.data.content.deck !== undefined) {
                if (fetcher.data.content.action === "add_to_deck") {
                    setDeckDraft((deck) => {
                        if (deck) {
                            return {
                                title: deck.title,
                                cards: [
                                    ...deck.cards,
                                    ...fetcher.data.content.deck
                                ]
                            };
                        } else {
                            return {
                                title: "",
                                cards: fetcher.data.content.deck
                            };
                        }
                    });
                } else if (fetcher.data.content.action === "replace_deck") {
                    setDeckDraft((deck) => ({
                        title: deck?.title || "",
                        cards: fetcher.data.content.deck
                    }));
                }
            }
            setPrompt("");
            setFileName("");
            setChatHistory((chat) => [
                ...chat,
                {
                    role: fetcher.data.role,
                    content: fetcher.data.content.answer
                }
            ]);
            setTimeout(() => document.querySelector("#chat > .chat-entry:last-child")?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            }), 100);
        }
    }, [fetcher.data]);

    const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files === null) return;
        setFileName(e.currentTarget?.files[0].name);
    }, [fileName]);

    const onSubmitButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        setTimeout(() => document.querySelector("#chat > .chat-entry:last-child")?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        }), 100);
        if (form) {
            fetcher.submit(form);
        }
    }, []);

    const handleTextareaChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            onSubmitButtonClick(e);
        }
    }, []);


    return (
        <>
            <div className="w-full h-2/3 pt-1 px-24 max-[1600px]:px-8">
                <ChatHistory messages={chatHistory} />
            </div>
            <div className="pb-12 w-full flex flex-col items-center">
                <div className="h-8 flex flex-col items-center justify-center">
                    <div className={clsx(
                        "size-4 bg-gray-800 rounded-[4px] transition-all animate-fast-spin",
                        fetcher.state === 'submitting' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    )} id="spinner"></div>
                </div>
                <fetcher.Form className={`${fetcher.state === 'submitting' && 'animate-pulse'} has-focus:shadow-lg has-focus:scale-[1.01] transition-all rounded-md ease-in-out duration-200 w-[calc(12/13*100%)] flex flex-col items-stretch focus:border-gray-400 focus:border-2 focus:border-solid`} method="post" encType="multipart/form-data">
                    <textarea
                        value={prompt}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        disabled={
                            fetcher.state === 'submitting'
                        }
                        className="resize-none w-full border-2 border-b-transparent h-24 p-4  focus:outline-none focus:ring-0 rounded-t-md
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
                    >
                    </textarea>
                    <div className="grid grid-cols-4 grid-rows-1 gap-3 py-2 border-2 border-t-transparent px-2 rounded-b-md">
                        <div className="inline-flex col-span-2">
                            <label htmlFor="knowledge-source" className="justify-self-start p-1.5 border-2 border-gray-400 rounded-full hover:cursor-pointer">
                                <Paperclip size={18} strokeWidth={1.5} className="text-gray-400" />
                            </label>
                            <input
                                accept="text/*"
                                ref={fileInputRef}
                                disabled={
                                    fetcher.state === 'submitting'
                                }
                                onChange={onFileChange}
                                type="file"
                                tabIndex={-1}
                                className="text-center hover:cursor-pointer text-transparent" name="knowledge-source" id="knowledge-source"
                                hidden
                            />
                            {fileName &&
                                <div className="text-center flex items-center justify-center  text-sm ml-2 max-w-2/3">
                                    <span className="bg-gray-100 text-gray-500 px-2 py-1.5 rounded-md text-nowrap truncate">
                                        <File className="inline" size={16} strokeWidth={1.25} /> {fileName}
                                    </span>
                                </div>
                            }
                        </div>

                        <button
                            className="justify-self-end place-self-end p-1.5 border-2 border-gray-400 rounded-full hover:cursor-pointer -col-start-2"
                            onClick={onSubmitButtonClick}
                            type="submit" disabled={fetcher.state === "submitting"}
                        >
                            <SendHorizontal size={18} strokeWidth={1.5} className="text-gray-400" />
                        </button>
                    </div>
                    <input type="hidden" name="chatUUID" value={params.chatId} />
                </fetcher.Form>
            </div>
        </>
    );
}
