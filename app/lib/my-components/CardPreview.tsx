import { useEffect, useMemo } from "react";
import { MarkdownRenderer } from "~/lib/utils/MarkdownRenderer";

interface Card {
    front: string;
    back: string;
}

interface CardPreviewProps {
    cards: Card[];
    previewIndex: number | null;
    onClose: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ cards, previewIndex, onClose }) => {
    if (previewIndex === null || previewIndex < 0 || previewIndex >= cards.length) return null;

    const card = cards[previewIndex];

    const [mdFront, mdBack] = useMemo(() => {
        const mdRenderer = new MarkdownRenderer();
        // console.log(card.back);
        return [
            mdRenderer.render(card.front),
            mdRenderer.render(card.back),
        ];
    }, [card]);

    useEffect(() => {
        const escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', escapeHandler);
        return () => document.removeEventListener('keydown', escapeHandler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-md relative max-w-md w-full mx-4 flex flex-col gap-3 font-mono">
                <button onClick={onClose} className="absolute top-1 right-3 text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer">&times;</button>
                <div className="mt-6 text-sm wrap-normal" dangerouslySetInnerHTML={{ __html: mdFront }}>
                    {/* {card.front} */}
                </div>
                <hr />
                <div className=" text-sm overflow-x-auto" dangerouslySetInnerHTML={{ __html: mdBack }}>
                    {/* {card.back} */}
                </div>
            </div>
        </div>
    );
};