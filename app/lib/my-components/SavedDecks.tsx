// import { Link } from "react-router";

interface SavedDecksProps {
    savedDecks: SavedDeck[];
}



export function SavedDecks({ savedDecks }: SavedDecksProps) {
    return (
        <ul>
            {savedDecks?.map((deck) => {
                return (<li key={deck.id}>
                    <a href={deck.url}>{deck.title}</a>
                </li>)
            })}
        </ul>
    )
}