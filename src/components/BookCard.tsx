import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { books } from "@prisma/client";
import { X, Heart } from "lucide-react";

import styles from "./BookCard.module.css";

interface BookCardProps {
  character: books;
  onSwipe: (dir: string, id: string) => void;
  onCardLeftScreen: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  character,
  onSwipe,
  onCardLeftScreen,
}) => {
  const [dragDirection, setDragDirection] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

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

  // 情報表示ボタンのクリックハンドラ
  const handleInfoButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックイベントが発火するのを防ぐ
    setShowInfo(!showInfo);
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
        <div className={styles.card}>
          {/* スワイプ時のラベル表示 */}
          {dragDirection && (
            <div className={`${styles.dragLabel} ${styles[dragDirection]}`}>
              {dragDirection === "right" ? "LIKE" : "NOPE"}
            </div>
          )}

          {/* 表面（本の表紙） */}
          <div
            style={{
              backgroundImage: `url(${character.cover || "/img/richard.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={styles.coverImage}
          >
            {/* 本の情報をオーバーレイ表示 */}
            <div className={styles.bookInfo}>
              <h2 className={styles.bookTitle}>{character.title}</h2>
              <p className={styles.bookAuthor}>{getAuthor()}</p>
              <p className={styles.bookPublished}>
                {new Date(character.published_at || "").toLocaleDateString()}
              </p>

              {/* 詳細情報ボタン */}
              {/* <button
                className={styles.detailButton}
                onClick={handleInfoButtonClick}
                aria-label="詳細情報"
              >
                <Info size={16} style={{ marginRight: '4px' }} />
                詳細を見る
              </button> */}
            </div>
          </div>

          {/* 情報モーダル - ボタンをクリックしたときのみ表示 */}
          {showInfo && (
            <div
              className={styles.infoModal}
              onClick={(e) => e.stopPropagation()} // モーダル内クリックの伝播を防止
            >
              <div className={styles.modalContent}>
                <button
                  className={styles.closeButton}
                  onClick={handleInfoButtonClick}
                >
                  ×
                </button>
                <h3 className={styles.title}>{character.title}</h3>
                <p className={styles.author}>著者: {getAuthor()}</p>

                {character.published_at && (
                  <p className={styles.date}>
                    発売日:{" "}
                    {new Date(character.published_at).toLocaleDateString()}
                  </p>
                )}

                {character.price && (
                  <p className={styles.price}>
                    価格: ¥{character.price.toLocaleString()}
                  </p>
                )}

                {character.content && (
                  <p className={styles.contentText}>
                    {character.content.replace(/<[^>]*>/g, "")}
                  </p>
                )}

                <p className={styles.isbn}>ISBN: {character.isbn}</p>
              </div>
            </div>
          )}
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
