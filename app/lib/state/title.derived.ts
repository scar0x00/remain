import { atom, type Getter, type Setter } from "jotai";
import { deckDraftAtom } from "./deckDraft";


export const titleAtom = atom((get) => {
    const deck = get(deckDraftAtom);
    return deck.title;
}, (_, set, newValue) => {
    if (typeof newValue !== "string") {
        throw Error("The new value for title is not a string");
    }
    set(deckDraftAtom, (prevDeck) => ({
        cards: prevDeck.cards,
        title: newValue,
    }));
});
