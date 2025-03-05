import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { books } from "@prisma/client";
import { X, Heart, Star } from "lucide-react";

import styles from "./BookCard.module.css";

interface BookCardProps {
  character: books;
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

  const handleButtonClick = (direction: string) => {
    handleSwipe(direction, character.isbn);
  };

  // 著者名を取得（contentから抽出するか、他のフィールドから取得）
  const getAuthor = () => {
    if (character.author) return character.author;
    // contentからの抽出ロジックがあれば追加
    return "著者不明";
  };

  return (
    <>
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
          {/* スワイプ時のラベル表示 */}
          {dragDirection && (
            <div className={`${styles.dragLabel} ${styles[dragDirection]}`}>
              {dragDirection === "right" ? "LIKE" : "NOPE"}
            </div>
          )}
          
          {/* 表面（本の表紙） */}
          <div
            style={{ backgroundImage: `url(${character.cover || ""})` }}
            className={styles.coverImage}
          >
            {/* 本の情報をオーバーレイ表示 */}
            <div className={styles.bookInfo}>
              <h2 className={styles.bookTitle}>{character.title}</h2>
              <p className={styles.bookAuthor}>{getAuthor()}</p>
              <p className={styles.bookPublished}>
                {new Date(character.published_at || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          
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
      
      {/* アクションボタン */}
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${styles.nope}`}
          onClick={() => handleButtonClick("left")}
          aria-label="Nope"
        >
          <X className={styles.actionIcon} />
        </button>
        <button
          className={`${styles.actionButton} ${styles.superLike}`}
          onClick={() => handleButtonClick("up")}
          aria-label="Super Like"
        >
          <Star className={styles.actionIcon} />
        </button>
        <button
          className={`${styles.actionButton} ${styles.like}`}
          onClick={() => handleButtonClick("right")}
          aria-label="Like"
        >
          <Heart className={styles.actionIcon} />
        </button>
      </div>
    </>
  );
};
