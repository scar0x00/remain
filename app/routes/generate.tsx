import { Outlet, redirect, type ShouldRevalidateFunctionArgs } from "react-router";
import { BookA, CirclePlus, Save, ScanEye } from "lucide-react";
import type { Route } from "./+types/generate";
import DeckPreview from "~/lib/my-components/DeckPreview";
import { useAtom, useSetAtom } from "jotai";
import { deckDraftAtom } from "~/lib/state/deckDraft";
import DeckCarousel from '~/lib/my-components/DeckCarousel';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import ToastNotification from "~/lib/my-components/ToastNotification";
import { getDeckById } from "~/lib/utils/getDeckById";
import { getChatHistory } from "~/lib/agents/deckGenerationAgent";
import { useHydrateAtoms } from "jotai/utils";
import { chatHistoryAtom } from "~/lib/state/chatHistory";
import { titleAtom } from "~/lib/state/title.derived";
import { SearchbleSavedDecks } from "~/lib/my-components/SearchableSavedDecks";


const API_BASE = process.env.API_BASE_URL || '';

export const links: Route.LinksFunction = () => [
    {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
        integrity: "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
        crossOrigin: "anonymous"
    },
]

export async function loader({ params }: Route.LoaderArgs) {
    if (params.chatId === undefined) {
        return redirect(`/generate/${crypto.randomUUID()}`)
    }

    const chatHistory = await getChatHistory(params.chatId);
    const deck = await getDeckById(params.chatId);

    const savedDecks = (
        await (await fetch(`${API_BASE}/api/v1/decks`)).json()
    ).decks.filter((deck: any) =>
        !!(deck?.customMetadata?.title)
    )?.map((deck: any) => ({
        title: deck.customMetadata.title,
        id: deck.key,
        url: `/generate/${deck.key}`
    }));


    return {
        chatHistory,
        deck,
        apiHost: API_BASE,
        savedDecks
    };
}

export function shouldRevalidate({
    actionResult,
    defaultShouldRevalidate,
    formAction,
    currentUrl
}: ShouldRevalidateFunctionArgs) {
    const currentPath = currentUrl.pathname;

    if (formAction === currentPath) {
        return false;
    }

    if (actionResult) {
        return false;
    }

    return defaultShouldRevalidate;
}

export default function Generate({
    params,
    loaderData
}: Route.ComponentProps) {
    useHydrateAtoms([
        [chatHistoryAtom, loaderData.chatHistory || []],
        [deckDraftAtom, loaderData.deck || []]
    ]);
    const [deckDraft, setDeckDraft] = useAtom(deckDraftAtom);
    const setChatHistory = useSetAtom(chatHistoryAtom);
    
    useEffect(() => {
        setChatHistory(loaderData.chatHistory);
        setDeckDraft(loaderData.deck);
    }, [loaderData.chatHistory, loaderData.deck]);
   


    const [showDeckCarousel, setShowDeckCarousel] = useState(false);
    const [showToast, setShowToast] = useState(false);
    // const [title, setTitle] = useState<string>(deckDraft?.title || "");
    const [title, setTitle] = useAtom(titleAtom);
    useEffect(() =>
        setTitle(deckDraft?.title || "")
    , [deckDraft?.title]);
    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    useEffect(() => {
        setDeckDraft(deck => ({ ...deck, title }));
    }, [title, setDeckDraft]);

    return (
        <div className="grid grid-rows-1 grid-cols-5 h-screen w-screen" id="main-container">
            <div className="col-start-1 flex flex-col justify-start px-3 pt-8 bg-gray-50 rounded-r-sm *:mt-3" id="sidebar">
                <h1 className="self-start text-xl">Remain</h1>
                <div className="" id="new-chat-button">
                    <a href="/generate">
                        <button className="p-2 text-sm text-gray-600 hover:cursor-pointer hover:text-black rounded-md bg-gray-200">
                            New chat &nbsp;<CirclePlus className="inline" size={20} />
                        </button>
                    </a>
                </div>
                <SearchbleSavedDecks savedDecks={loaderData.savedDecks}/>
            </div>
            <div className="col-start-2 col-span-3 px-20 max-[1200px]:px-8 flex flex-col justify-between">
                <div className="mt-2 flex items-center mx-16">
                    <BookA className="mr-2 size-6 text-gray-300 has-[+_:focus]:text-gray-500"></BookA>
                    <input id="deck-title" className={`
                        text-xl place-self-stretch flex-1 border-2 py-1 px-2 rounded-md border-transparent transition-colors mr-16
                        focus:outline-none focus:border-gray-300`}
                        placeholder="Set title..."
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <Outlet />
            </div>
            <div className="-col-start-2 px-3 pb-2 bg-gray-50 rounded-l-md overflow-y-auto overflow-x-clip scrollbar-thin relative">
                <div className='sticky top-0 py-4 inline-flex justify-start items-center bg-gray-50 w-full' >
                    <h2 className="text-xl hover:cursor-pointer" onClick={() => setShowDeckCarousel(true)}>Deck <ScanEye className='inline size-6 hover:cursor-pointer text-gray-600' /></h2>
                    <div className="flex justify-center items-center ml-auto h-full">
                        {showToast && <ToastNotification message="Deck saved" isVisible={showToast} onClose={() => setShowToast(false)} />}
                        <Save className='inline size-6 hover:cursor-pointer text-gray-600' onClick={async () => {
                            await fetch(`${loaderData.apiHost}/api/v1/deck/${params.chatId}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    title,
                                    cards: deckDraft.cards
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            setShowToast(true);
                        }
                        } />
                    </div>
                </div>
                {showDeckCarousel && <DeckCarousel cards={deckDraft.cards} onClose={() => setShowDeckCarousel(false)} />}
                <DeckPreview cards={deckDraft.cards} />
            </div>
        </div>
    );
}