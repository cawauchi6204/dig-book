import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { Database } from "../../types/supabasetype";

import styles from "./BookCard.module.css";

interface BookCardProps {
  character: Database["public"]["Tables"]["books"]["Row"];
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
  const [dragDirection, setDragDirection] = useState<string | null>(null);
  const handleSwipe = (
    dir: string,
    id: string,
    event?: React.MouseEvent | React.TouchEvent
  ) => {
    const normalizedDir =
      dir === "up"
        ? (event as React.MouseEvent)?.clientX > window.innerWidth / 2
          ? "right"
          : "left"
        : dir;
    setDragDirection(normalizedDir);
    onSwipe(normalizedDir, id);
    onCardLeftScreen(id);
  };

  return (
    <TinderCard
      className={styles.tinderCard}
      key={character.isbn}
      onSwipe={(dir) => handleSwipe(dir, character.isbn)}
      swipeRequirementType="position"
      swipeThreshold={1}
      preventSwipe={["up", "down"]}
    >
      <div
        onClick={(e) => onInteraction(character.isbn, e)}
        onTouchStart={(e) => onInteraction(character.isbn, e)}
        className={`${styles.card} ${
          flipped[character.isbn] ? styles.flipped : ""
        }`}
      >
        {/* Likeの表示 */}
        {dragDirection && (
          <div className={`${styles.dragLabel} ${styles[dragDirection]}`}>
            {dragDirection === "right" ? "LIKE!" : "NOPE!"}
          </div>
        )}
        {/* 表面（本の表紙） */}
        <div
          style={{ backgroundImage: `url(${character.cover || ""})` }}
          className={styles.coverImage}
        ></div>
        {/* 裏面（本の内容） */}
        <div
          className={styles.content}
          onClick={(e) => {
            // カードが裏面の時は、クリックイベントの伝播を止めて
            // カード全体のクリックイベントが発火するのを防ぐ
            if (flipped[character.isbn]) {
              e.stopPropagation();
            }
          }}
        >
          <h3 className={styles.title}>{character.title}</h3>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: character.content || "" }}
          ></div>
          <div className={styles.footer}>
            <p className={styles.date}>
              発売日:{" "}
              {new Date(character.published_at || "").toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </TinderCard>
  );
};
