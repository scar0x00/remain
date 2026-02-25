import { getDeckById } from "~/lib/utils/getDeckById";
import type { Route } from "./+types/study.$deckId";
import { useEffect, useMemo, useState } from "react";
import { MarkdownRenderer } from "~/lib/utils/MarkdownRenderer";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link, useRevalidator, useRouteLoaderData } from "react-router";
import clsx from "clsx";
import '~/styles/atom-one-light.css';

export async function loader({ params, request }: Route.LoaderArgs) {
    const deck = await getDeckById(params.deckId, request.headers);

    return {
        deck,
        deckId: params.deckId,
        sessionId: crypto.randomUUID(),
    }
}

export const links: Route.LinksFunction = () => [
    {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
        integrity: "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
        crossOrigin: "anonymous"
    },
];


export default function Study({
    loaderData
}: Route.ComponentProps) {
    const [cardIndex, setCardIndex] = useState(0);
    const revalidator = useRevalidator();

    const { API_BASE } = useRouteLoaderData('root');



    const [showBack, setShowBack] = useState(false);
    const [results, setResults] = useState({
        right: 0,
        wrong: 0,
        passed: 0,
        wrongIndexes: [] as number[],
    });


    const handleRestart = () => {
        setResults({
            right: 0,
            wrong: 0,
            passed: 0,
            wrongIndexes: [],
        });
        setShowBack(false);
        setCardIndex(0);
        revalidator.revalidate();
    };

    const card = loaderData.deck.cards[cardIndex];
    const [mdFront, mdBack] = useMemo(() => {
        const mdRenderer = new MarkdownRenderer();
        return [
            mdRenderer.render(card?.front || ''),
            mdRenderer.render(card?.back || ''),
        ];
    }, [card]);


    useEffect(() => {
        const isFinished = cardIndex === loaderData.deck.cards.length;
        if (isFinished && loaderData.deck.cards.length > 0) {
            const res = fetch(`${API_BASE}/api/v1/study_session/${loaderData.deckId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correct_count: results.right,
                    incorrect_count: results.wrong,
                    wrong_answers_indexes: results.wrongIndexes,
                    session_id: loaderData.sessionId
                }),
                credentials: "include"
            })
                .catch(err => console.error("Failed to sync study session:", err))
                .then((r) => r?.json()).then(console.log);
        }
    }, [cardIndex, loaderData.deck.cards.length, loaderData.deckId, results]);


    return (
        <div className="fixed inset-0 grid grid-cols-1 grid-rows-7 gap-4 z-50 px-2">
            <div className="row-span-1 mt-4 flex justify-between">
                <Link to="/decks" viewTransition className={clsx({
                    "opacity-0": cardIndex === loaderData.deck.cards.length
                })}>
                    <ArrowLeft />
                </Link>
                <span className="text-gray-400 truncate inline-block px-3">{loaderData.deck.title}</span>
                <RotateCcw onClick={handleRestart} className={clsx({
                    "opacity-0": cardIndex === loaderData.deck.cards.length
                })} />
            </div>
            <div className="row-start-2 row-span-5 flex flex-col gap-6">
                {cardIndex < loaderData.deck.cards.length && <>
                    <div className="text-lg wrap-normal bg-white p-4 rounded-md  shadow-gray-100 relative w-full" dangerouslySetInnerHTML={{ __html: mdFront }}>
                    </div>
                    {showBack &&
                        <div className="text-base overflow-x-auto align-middle overflow-hidden bg-white p-4 rounded-md  shadow-gray-100 relative max-w-md w-full"
                            dangerouslySetInnerHTML={{ __html: mdBack }}
                        >
                        </div>
                    }
                </>}
                {cardIndex === loaderData.deck.cards.length &&
                    <div className="flex flex-col items-center gap-8">
                        <Link to="/decks" viewTransition className="flex-inline justify-center items-center flex-row bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
                            <ArrowLeft className="inline" size={14} /> Go back to decks
                        </Link>
                        <button className="flex-inline justify-center items-center flex-row bg-gray-800 text-gray-100 px-4 py-2 rounded-md"
                            onClick={handleRestart}
                        >
                            <RotateCcw className="inline" size={14} /> Restart
                        </button>
                        <div className="text-lg mt-7 font-extrabold">
                            <span className="text-green-500">{results.right} right</span>, <span className="text-red-400">{results.wrong} wrong</span>
                        </div>
                    </div>
                }
            </div>
            <div className="row-start-7 text-center flex justify-center gap-6  [&_button]:rounded-md">
                {(!showBack && cardIndex < loaderData.deck.cards.length) && <button onClick={() => setShowBack(true)} className="self-center p-3 bg-gray-100">Show answer</button>}
                {(showBack && cardIndex < loaderData.deck.cards.length) &&
                    <div className="flex gap-16 items-center [&_button]:py-3 [&_button]:px-6">

                        <button onClick={() => {
                            setShowBack(i => !i);
                            setResults(i => ({
                                ...i,
                                wrong: i.wrong + 1,
                                wrongIndexes: [...i.wrongIndexes, cardIndex]
                            }));
                            setCardIndex(i => Math.min(i + 1, loaderData.deck.cards.length));
                        }} className="bg-gray-900 text-gray-200">Wrong</button>

                        <button onClick={() => {
                            setShowBack(i => !i);
                            setResults(i => ({
                                ...i,
                                right: i.right + 1
                            }));
                            setCardIndex(i => Math.min(i + 1, loaderData.deck.cards.length));
                        }} className="bg-gray-100 text-gray-950">Right</button>

                    </div>
                }
                {

                }
            </div>
        </div>
    );
};