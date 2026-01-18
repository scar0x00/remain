import { atom } from 'jotai';

interface Message {
  role: "agent" | "user";
  content: string;
}

export const chatHistoryAtom = atom<Message[]>([]);