import { useFetcher, Outlet, redirect } from "react-router";
import { CirclePlus, Save, ScanEye } from "lucide-react";
import type { Route } from "./+types/generate";
import DeckPreview from "~/lib/my-components/DeckPreview";
import { useAtomValue } from "jotai";
import { deckDraftAtom } from "~/lib/state/deckDraft";
import DeckCarousel from '~/lib/my-components/DeckCarousel';
import { useState } from 'react';


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
    return {};
}

export default function Generate({ params }: Route.ComponentProps) {
    const deckDraft = useAtomValue(deckDraftAtom);
    const [showDeckCarousel, setShowDeckCarousel] = useState(false);
    return (
        <div className="grid grid-rows-1 grid-cols-5 h-screen w-screen" id="main-container">
            <div className="col-start-1 flex flex-col justify-start items-stretch px-3 pt-8 bg-gray-50 rounded-r-sm *:mt-3" id="sidebar">
                <h1 className="self-start text-xl">Remain</h1>
                <div className="">
                    <a href="/generate">
                        <button className="p-2 text-sm text-gray-600 hover:cursor-pointer hover:text-black rounded-md bg-gray-200">
                            New chat &nbsp;<CirclePlus className="inline" size={20} />
                        </button>
                    </a>
                </div>
            </div>
            <div className="col-start-2 col-span-3 px-20 max-[1200px]:px-8 flex flex-col justify-between">
                <Outlet />
            </div>
            <div className="-col-start-2 px-3 pb-2 bg-gray-50 rounded-l-md overflow-y-auto overflow-x-clip scrollbar-thin relative
            ">
                <div className='sticky top-0 py-4 inline-flex justify-start items-center bg-gray-50 w-full' >
                    <h2 className="text-xl hover:cursor-pointer" onClick={() => setShowDeckCarousel(true)}>Deck <ScanEye className='inline size-6 hover:cursor-pointer text-gray-600' /></h2>
                    <div className="flex justify-center items-center ml-auto h-full">
                        <Save className='inline size-6 hover:cursor-pointer text-gray-600' onClick={async () => 
                            await fetch(`/api/v1/deck/${params.chatId}`, {
                                method: "PUT",
                                body: JSON.stringify(deckDraft),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                        }/>
                    </div>
                </div>
                {showDeckCarousel && <DeckCarousel cards={deckDraft} onClose={() => setShowDeckCarousel(false)} />}
                <DeckPreview cards={deckDraft} />
            </div>
        </div>
    );
}