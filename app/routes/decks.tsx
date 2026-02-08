import type { Route } from "./+types/decks";
import { useThrottle } from "@uidotdev/usehooks";
import clsx from "clsx";
import { BookA, PanelRight, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { calculateTemporalDiff } from "~/lib/utils/calculateTemporalDiff";
import { calculateTemporalDiffHours } from "~/lib/utils/calculateTemporalDiffHours";
import { getScoreStyle } from "~/lib/utils/getScoreStyle";
import { requireSession } from "~/lib/utils/requireSession";
import { API_BASE } from "~/lib/utils/env.server";
import { useNavbar } from "~/lib/my-components/Navbar";


export async function loader({
    request
}: Route.LoaderArgs) {
    const user = await requireSession(request);
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
        ...deck,
        id: deck.key,
        url: `/study/${deck.key}`,
        uploaded: new Date(deck.uploaded),
    }));

    return {
        decks: savedDecks,
    }
}


export default function Decks({ loaderData }: Route.ComponentProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const throttleSearchTerm = useThrottle(searchTerm, 400);
    const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, [setSearchTerm]);
    const { setShowNavbar, Navbar } = useNavbar();

    return (
        <div className="mt-2 px-1">
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
            <div className="flex items-center justify-between mx-3 mb-8">
                <h1 className="text-2xl font-bold text-gray-400">Decks</h1>
                <PanelRight className="text-gray-400" onClick={() => setShowNavbar(true)}/>
            </div>
            <div className="flex items-center justify-center mb-3">
                <input type="text" id="search-deck" className={`
                    text-base border-2 py-1 px-2 rounded-md border-gray-200 transition-colors
                        focus:outline-none focus:border-gray-400 w-[80%] mr-1
                `} onChange={handleOnChange} />
                <Search className="text-gray-400" />
            </div>
            <ul className="flex flex-col gap-5 mb-4">
                {
                    loaderData.decks
                        .filter(
                            (item: SavedDeck) => item.title.toLowerCase().includes(throttleSearchTerm.toLowerCase())
                        ).map((deck: SavedDeck) => {
                            return (
                                <li key={deck.id} className={`
                                    my-1 text-gray-600 hover:text-gray-900 truncate
                                    py-1 px-2 mx-1 border-b border-b-gray-100 pb-3
                                `}>
                                    <span className={clsx(
                                        "after:text-gray-900",
                                        "w-full",
                                    )}>
                                        <span className="flex items-center justify-between">
                                            <Link to={deck.url} className="flex items-center max-w-[80%]" viewTransition>
                                                <BookA size={16} className="inline-block mr-1 shrink-0" />
                                                <span className="truncate">
                                                    {deck.title}
                                                </span>
                                            </Link>
                                            <span>
                                                <Link to={`/generate/${deck.id}`} viewTransition
                                                    className="text-sm items-center text-gray-400 underline text-right font-light">
                                                    {/* <Pencil className="inline" size={14}/> */}
                                                    Edit
                                                </Link>
                                            </span>
                                        </span>
                                        <span className="text-sm flex justify-between">
                                            <span className="font-light text-gray-400">
                                                {deck.length} cards
                                            </span>
                                            <span className={`text-xs font-bold`} style={getScoreStyle(deck.score)}>
                                                {deck.score?.toFixed(2)}
                                            </span>
                                        </span>
                                        <span className="text-xs tracking-tighter text-gray-400 align-middle flex justify-between font-light">
                                            {
                                                calculateTemporalDiff(new Date(deck.uploaded)) > 0 ?
                                                    `Created ${calculateTemporalDiff(new Date(deck.uploaded))} days ago` :
                                                    `Created today`
                                            }
                                            <span>
                                                {
                                                    calculateTemporalDiffHours(new Date(deck.last_session)) > 0 ?
                                                        `${calculateTemporalDiffHours(new Date(deck.last_session))} hours since last session` :
                                                        "never studied"
                                                }
                                            </span>
                                        </span>
                                    </span>
                                </li>
                            )
                        })}
            </ul>
        </div>
    );
}