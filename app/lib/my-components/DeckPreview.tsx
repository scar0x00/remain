import React from 'react';

interface Card {
  front: string;
  back: string;
}

interface DeckPreviewProps {
  cards: Card[];
}

const DeckPreview: React.FC<DeckPreviewProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="flex flex-col justify-center items-center">
      {cards.map((card, index) => (
        <div key={index} className="mb-2 bg-gray-100 text-gray-700 p-2 text-xs font-mono w-full rounded-md">
          {card.front}
        </div>
      ))}
    </div>
  );
};

export default DeckPreview;