import clsx from "clsx";
import { Link } from "react-router";
import { calculateTemporalDiff } from "../utils/calculateTemporalDiff";

interface SavedDecksProps {
    savedDecks: SavedDeck[];
}



export function SavedDecks({ savedDecks }: SavedDecksProps) {
    return (
        <ul>
            {savedDecks?.map((deck) => {
                return (<li key={deck.id} className={`
                    my-1 text-gray-600 hover:text-gray-900 truncate
                `}>
                    <Link to={deck.url} viewTransition className={clsx(
                        "after:text-gray-900",
                        // "after:ml-0.5"
                    )}>
                        {deck.title}
                        <span className="text-xs tracking-tighter ml-3 text-gray-400">{calculateTemporalDiff(new Date(deck.uploaded))} days ago</span>
                    </Link>
                </li>)
            })}
        </ul>
    )
}