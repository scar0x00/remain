import { useAtom, useSetAtom } from 'jotai';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CardPreview } from '~/lib/my-components/CardPreview';
import { deckDraftAtom } from '~/lib/state/deckDraft';
import { MarkdownRenderer } from '~/lib/utils/MarkdownRenderer';
import CardEditor from '~/lib/my-components/CardEditor';
import '~/styles/atom-one-light.css';


interface DeckPreviewProps {
  cards: Flashcard[];
}

const DeckPreview: React.FC<DeckPreviewProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;
  const setDeckDraft = useSetAtom(deckDraftAtom);

  const [previewCard, setPreviewCard] = useState<number | null>(null);
  const [draftDeck, setDraftDeck] = useAtom(deckDraftAtom);
  const [showCardEditor, setShowCardEditor] = useState<null | number>(null);

  const [mdRenderer] = useMemo(() => {
    const mdRenderer = new MarkdownRenderer();
    return [
      mdRenderer
    ];
  }, [cards]);

  /**
   * This implementation to handle keystrokes is fragile.
   * It must be refactored.
   */
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPreviewCard(i => i === null ? i : Math.max(i - 1, 0));
      } else if (e.key === "ArrowRight") {
        setPreviewCard(i => i === null ? i : Math.min(i + 1, draftDeck.cards.length - 1));
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [draftDeck]);

  return (
    <div className="flex flex-col justify-center items-center">
      <CardPreview cards={cards} previewIndex={previewCard} onClose={() => setPreviewCard(null)} />
      {cards.map((card, index) => (
        <div key={index} className="mb-2 bg-linear-to-bl from-gray-100 to-gray-50 text-gray-700 p-2 text-xs w-full rounded-md grid grid-cols-5 grid-rows-[2] gap-3">
          <div className="col-span-3 col-start-3 row-start-1 justify-end inline-flex gap-2">
            <Trash size={14} className="text-gray-400 hover:cursor-pointer hover:text-gray-600" onClick={() => setDraftDeck(deck => {
              return { ...deck, cards: deck.cards.filter((_, i) => i !== index) };
            })} />
            <Pencil size={14} className="text-gray-400 hover:cursor-pointer hover:text-gray-600" onClick={() => setShowCardEditor(index)} />
            {showCardEditor === index && <CardEditor card={card} onClose={() => setShowCardEditor(null)} onSave={(card) => {
                setDeckDraft((deck) => ({ ...deck, cards: deck.cards.map((item, i) => index === i ? card : item) }));
                setShowCardEditor(null);
            }} />}
            <Eye size={14} className="text-gray-400 hover:cursor-pointer hover:text-gray-600" onClick={() => setPreviewCard(index)} />
          </div>
          <div className="col-span-5 col-start-1 row-start-2" dangerouslySetInnerHTML={{ __html: mdRenderer.render(card.front) }}>
            {/* {card.front} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeckPreview;