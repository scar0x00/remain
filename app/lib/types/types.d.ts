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
  title: string;
  url: string
  id: string
}