import { useFetcher, Outlet, redirect } from "react-router";
import { CirclePlus } from "lucide-react";
import type { Route } from "./+types/generate";
import DeckPreview from "~/lib/my-components/DeckPreview";
import { useAtomValue } from "jotai";
import { deckDraftAtom } from "~/lib/state/deckDraft";

export async function loader({ params }: Route.LoaderArgs) {
    if (params.chatId === undefined) {
        return redirect(`/generate/${crypto.randomUUID()}`)
    }
    return {};
}

export default function Generate({ }: Route.ComponentProps) {
    const deckDraft = useAtomValue(deckDraftAtom);
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
            <div className="-col-start-2 px-3 py-2 bg-gray-50 rounded-l-md overflow-y-scroll overflow-x-clip">
                <DeckPreview cards={deckDraft} />
            </div>
        </div>
    );
}