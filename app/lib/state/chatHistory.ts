import { atom } from 'jotai';

export interface Message {
  role: "agent" | "user";
  content: string;
}

export const chatHistoryAtom = atom<Message[]>([]);

export function createHistoryAtom(messages: Message[]) {
  return atom<Message[]>(messages);
}