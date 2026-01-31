import { Link } from "react-router";

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
                    <Link to={deck.url} viewTransition>{deck.title}</Link>
                </li>)
            })}
        </ul>
    )
}