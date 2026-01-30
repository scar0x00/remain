import { atom } from 'jotai';

export const deckDraftAtom = atom<Deck>({
  title: "",
  cards: []
});