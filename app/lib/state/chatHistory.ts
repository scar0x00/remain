import { atom } from 'jotai';

export const chatHistoryAtom = atom<Message[]>([]);