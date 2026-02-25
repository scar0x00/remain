import type { Route } from "./+types/generate";
import { Outlet, redirect, useRouteLoaderData, type ShouldRevalidateFunctionArgs } from "react-router";
import { BookA, CirclePlus, CircleX, Layers, Menu, PanelRight, Save, ScanEye } from "lucide-react";
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
import { useNavbar } from "~/lib/my-components/Navbar";
import { requireSession } from "~/lib/utils/requireSession";
import { API_BASE } from "~/lib/utils/env.server";
import clsx from "clsx";


export const links: Route.LinksFunction = () => [
    {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
        integrity: "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
        crossOrigin: "anonymous"
    },
]

export async function loader({
    params,
    request
}: Route.LoaderArgs) {
    const user = await requireSession(request);
    if (params.chatId === undefined) {
        return redirect(`/generate/${crypto.randomUUID()}`)
    }

    const chatHistory = await getChatHistory(params.chatId, user.id);
    const deck = await getDeckById(params.chatId, request.headers);

    const savedDecks = (
        await (await fetch(
            `${API_BASE}/api/v1/decks`,
            {
                headers: request.headers,
                credentials: "include"
            }
        )).json()
    ).decks.filter((deck: any) =>
        !!(deck?.title)
    )?.map((deck: any) => ({
        title: deck.title,
        id: deck.key,
        url: `/generate/${deck.key}`,
        uploaded: new Date(deck.uploaded),
    }));


    return {
        chatHistory,
        deck,
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
        [deckDraftAtom, loaderData.deck || { title: "", cards: [] }],
    ]);
    const [deckDraft, setDeckDraft] = useAtom(deckDraftAtom);
    const setChatHistory = useSetAtom(chatHistoryAtom);
    const [title, setTitle] = useAtom(titleAtom);

    const { API_BASE } = useRouteLoaderData('root');

    useEffect(() => {
        console.log(loaderData.deck || { title: "", cards: [] });
        setChatHistory(loaderData.chatHistory || []);
        setDeckDraft(loaderData.deck || { title: "", cards: [] });
        // setTitle(loaderData.deck?.title || "");
        // this is not supposed to be needed, just that i think that the vite compiler is doing something funky cause sometimes the title atom seems to be out of sync
    }, [loaderData.chatHistory, loaderData.deck]);

    const [showDeckCarousel, setShowDeckCarousel] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    // useEffect(() => {
    //     setDeckDraft(deck => ({ ...deck, title }));
    // }, [title, setDeckDraft]);
    // this is not supposed to be needed, just that i think that the vite compiler is doing something funky cause sometimes the title atom seems to be out of sync

    const [showDeckDraft, setShowDeckDraft] = useState(false);
    const [showSavedDecks, setShowSavedDecks] = useState(false);

    const { setShowNavbar, Navbar } = useNavbar();


    return (
        <div className="grid min-[1100px]:grid-rows-1 grid-cols-5 h-dvh w-dvw" id="main-container">
            <div className="col-span-5 min-[1100px]:hidden sticky top-0 grid grid-rows-1 grid-cols-8 py-2 px-3 gap-1 border-b border-b-gray-200 bg-white z-40">
                <div className="col-start-1 min-[1100px]:hidden" onClick={() => {
                    setShowSavedDecks(true);
                }}>
                    <PanelRight className="text-gray-400" />
                </div>
                <div className="-col-start-2 min-[700px]:hidden" onClick={() => {
                    setShowDeckDraft(true);
                }}>
                    <Layers className="text-gray-400" />
                </div>
                <div className="-col-start-1 min-[1100px]:hidden min-[700px]:mr-2" onClick={() => setShowNavbar(true)}>
                    <Menu className="text-gray-400" />
                </div>
            </div>
            <Navbar
                links={[
                    {
                        displayText: "Generate",
                        url: "/generate"
                    },
                    {
                        displayText: "Decks",
                        url: "/decks"
                    },
                    {
                        displayText: "My profile",
                        url: "/my"
                    }
                ]}
            ></Navbar>
            <div className={clsx(
                "col-start-1 flex flex-col justify-start px-3 pt-2 max-[1100px]:pt-4 bg-gray-50 gap-2",
                "max-[1100px]:z-50 max-[1100px]:fixed max-[1100px]:left-0 max-[1100px]:h-dvh",
                {
                    "max-[1100px]:hidden": !showSavedDecks
                }
            )} id="sidebar">
                <CircleX className="size-8 hover:cursor-pointer text-gray-600 min-[1100px]:hidden text-left" onClick={() => setShowSavedDecks(false)} />
                <div className="max-[1100px]:hidden hover:cursor-pointer" onClick={() => setShowNavbar(true)}>
                    <Menu className="text-gray-400" />
                </div>
                <h1 className="text-xl mt-2">Remain</h1>
                <div className="" id="new-chat-button">
                    <a href="/generate">
                        <button className="p-2 text-sm text-gray-600 hover:cursor-pointer hover:text-black rounded-md bg-gray-200">
                            New chat &nbsp;<CirclePlus className="inline" size={20} />
                        </button>
                    </a>
                </div>
                <SearchbleSavedDecks savedDecks={loaderData.savedDecks} />
            </div>
            <div className={
                "max-[700px]:top-0 max-[700px]:row-start-2 col-start-2 max-[1100px]:col-start-1 col-span-3 max-[700px]:col-span-5 px-20 max-[1200px]:px-8 max-[850px]:px-2 flex flex-col justify-between max-[700px]:z-30"
            }>
                <div className="mt-2 flex items-center mx-16 max-[930px]:mx-2 gap-0.5 max-[700px]:sticky">
                    <BookA className="size-6 text-gray-300 has-[+_:focus]:text-gray-500 shrink-0"></BookA>
                    <input id="deck-title" className={clsx(`
                        text-xl place-self-stretch flex-1 border-2 py-1 px-2 rounded-md border-transparent transition-colors mr-16 max-[930px]:mr-0 max-[930px]:max-w-[calc(100%-1.8rem)]
                        max-[500px]:text-lg
                        focus:outline-none focus:border-gray-300`
                    )}
                        placeholder="Set title..."
                        value={title || ""} // the title value has changing from a string to undefined. React sees this as an error.
                        onChange={handleTitleChange}
                    />
                </div>
                <Outlet />
            </div>
            <div id="deck-draft" className={clsx(
                "-col-start-2 px-3 pb-2 bg-gray-50 overflow-y-auto overflow-x-clip scrollbar-thin relative",
                "max-[1100px]:-col-start-3 max-[1100px]:col-span-2 max-[700px]:z-50 max-[700px]:fixed max-[700px]:right-0 max-[700px]:h-dvh max-[500px]:min-w-[80vw]",
                {
                    "max-[700px]:hidden": !showDeckDraft,
                }
            )}>
                <div className='sticky top-0 py-2 inline-flex justify-start items-center bg-gray-50 w-full z-20' >
                    <h2 className="text-xl hover:cursor-pointer" onClick={() => setShowDeckCarousel(true)}>Deck <ScanEye className='inline size-4 hover:cursor-pointer text-gray-600' /></h2>
                    <div className="flex justify-center items-center ml-auto h-full gap-5">
                        {showToast && <ToastNotification message="Deck saved" isVisible={showToast} onClose={() => setShowToast(false)} />}
                        <CircleX className="size-6 hover:cursor-pointer text-gray-600 min-[700px]:hidden" onClick={() => setShowDeckDraft(false)} />
                        <Save className='inline size-6 hover:cursor-pointer text-gray-600' onClick={async () => {
                            await fetch(`${API_BASE}/api/v1/deck/${params.chatId}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    title,
                                    cards: deckDraft.cards
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                credentials: "include"
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