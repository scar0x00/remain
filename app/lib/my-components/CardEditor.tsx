import { useState, useMemo, useEffect } from "react";
import { X, Check } from "lucide-react";
import { MarkdownRenderer } from "~/lib/utils/MarkdownRenderer";
import '~/styles/gruvbox-dark-soft.min.css';

interface Card {
    front: string;
    back: string;
}

interface CardEditorProps {
    card?: Card;
    onClose: () => void;
    onSave: (card: Card) => void;
}

export default function CardEditor({ card, onClose, onSave }: CardEditorProps) {
    const [front, setFront] = useState(card?.front || '');
    const [back, setBack] = useState(card?.back || '');

    const [mdRenderer] = useMemo(() => {
        const mdRenderer = new MarkdownRenderer();
        return [mdRenderer];
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative">
                <button
                    onClick={onClose}
                    className="hover:cursor-pointer shadow-md absolute -top-12 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onSave({front, back})}
                    className="hover:cursor-pointer shadow-md absolute -top-12 left-14 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
                    aria-label="Save"
                >
                    <Check className="h-5 w-5" />
                </button>
                <div className="relative w-248 max-w-[90vw] h-150 max-h-[90vh] bg-white/90 rounded-xl">
                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-0">
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Front</label>
                            <textarea
                                value={front}
                                onChange={(e) => setFront(e.target.value)}
                                className="scrollbar-thin font-mono w-full h-[calc(100%-40px)] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-gray-400 text-gray-900 bg-white text-[0.9rem]"
                                placeholder="Enter front content..."
                            />
                        </div>
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">Front Preview</label>
                            <div
                                className="scrollbar-thin w-full h-[calc(100%-40px)] p-3 border border-gray-200 rounded-md overflow-auto text-gray-900 bg-gray-50 text-base"
                                dangerouslySetInnerHTML={{ __html: mdRenderer.render(front) }}
                            />
                        </div>
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Back</label>
                            <textarea
                                value={back}
                                onChange={(e) => setBack(e.target.value)}
                                className="scrollbar-thin font-mono w-full h-[calc(100%-40px)] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-gray-400 text-gray-900 bg-white text-[0.9rem]"
                                placeholder="Enter back content..."
                            />
                        </div>
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">Back Preview</label>
                            <div
                                className="scrollbar-thin w-full h-[calc(100%-40px)] p-3 border border-gray-200 rounded-md overflow-auto text-gray-900 bg-gray-50 text-base"
                                dangerouslySetInnerHTML={{ __html: mdRenderer.render(back) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
