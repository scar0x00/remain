interface Flashcard {
  front: string;
  back: string;
}

interface Deck {
  title: string;
  cards: Flashcard[]
}

interface Message {
  role: "agent" | "user";
  content: string;
}

interface SavedDeck {
  key: string;
  title: string;
  url: string;
  id: string;
  uploaded: Date;
  length: number;
  score: number;
  last_session: string;
}