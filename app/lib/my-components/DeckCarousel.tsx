import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { MarkdownRenderer } from "~/lib/utils/MarkdownRenderer";

interface DeckCarouselProps {
    cards: Flashcard[];
    onClose: () => void;
}

export default function DeckCarousel({ cards, onClose }: DeckCarouselProps) {
    const [mdRenderer] = useMemo(() => {
            const mdRenderer = new MarkdownRenderer();
            return [
                mdRenderer
            ];
        }, [cards]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        containerRef.current?.focus();
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const closeHandler = useMemo(() => {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            onClose();
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative">
                <button
                    onClick={closeHandler}
                    className="absolute -top-12 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white hover:cursor-pointer transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
                <div ref={containerRef} tabIndex={0} className="h-[75vh] w-150 overflow-y-auto scrollbar-thin scroll-smooth snap-y snap-mandatory rounded-lg bg-white shadow-2xl outline-none">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="min-h-[25vh] w-full snap-start flex flex-col items-center justify-center p-8 gap-3"
                        >
                            <div className="text-center">
                                <div className="text-lg" dangerouslySetInnerHTML={{ __html: mdRenderer.render(card.front) }}></div>
                            </div>
                            <div className="text-center border-t pt-4 overflow-x-auto overflow-hidden max-w-full scrollbar-thin">
                                <div className="text-md text-gray-700" dangerouslySetInnerHTML={{ __html: mdRenderer.render(card.back) }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
