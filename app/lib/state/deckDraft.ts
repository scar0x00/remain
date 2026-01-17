import { atom } from 'jotai';

interface Flashcard {
  front: string;
  back: string;
}

export const chatHistoryAtom = atom<Flashcard[]>([]);