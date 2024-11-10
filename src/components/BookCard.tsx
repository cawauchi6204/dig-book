import React from "react";
import TinderCard from "react-tinder-card";
import { Book } from "../../types/Book";

interface BookCardProps {
  character: Book;
  flipped: { [key: string]: boolean };
  onSwipe: (dir: string, id: string) => void;
  onCardLeftScreen: (id: string) => void;
  onInteraction: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  character,
  flipped,
  onSwipe,
  onCardLeftScreen,
  onInteraction,
}) => {
  return (
    <TinderCard
      className="absolute w-full h-full"
      key={character.id}
      onSwipe={(dir) => onSwipe(dir, character.id)}
      onCardLeftScreen={() => onCardLeftScreen(character.id)}
    >
      <div
        onClick={(e) => onInteraction(character.id, e)}
        onTouchStart={(e) => onInteraction(character.id, e)}
        className={`relative w-[90vw] h-[calc(90vw*1.4)] max-w-[500px] max-h-[700px] mx-auto rounded-sm shadow-[5px_5px_10px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-700 preserve-3d ${
          flipped[character.id] ? "rotate-y-180" : ""
        }`}
      >
        {/* 表面（本の表紙） */}
        <div
          style={{ backgroundImage: `url(${character.cover[0].url})` }}
          className="absolute w-full h-full rounded-sm bg-cover bg-center backface-hidden"
        ></div>
        {/* 裏面（本の内容） */}
        <div className="absolute w-full h-full rounded-sm bg-white p-4 rotate-y-180 backface-hidden overflow-y-auto">
          <h3 className="font-bold text-xl mb-2 text-gray-800">
            {character.title}
          </h3>
          <div
            className="text-gray-600 text-sm prose prose-sm"
            dangerouslySetInnerHTML={{ __html: character.content }}
          ></div>
          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              作成日: {new Date(character.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-xs">
              更新日: {new Date(character.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </TinderCard>
  );
};