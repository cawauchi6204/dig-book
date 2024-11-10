import React from "react";
import TinderCard from "react-tinder-card";
import { Database } from "../../database.types";

// 新しいスタイルシートをインポート
import styles from './BookCard.module.css';

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
  return (
    <TinderCard
      className={styles.tinderCard}
      key={character.id}
      onSwipe={(dir) => onSwipe(dir, character.id)}
      onCardLeftScreen={() => onCardLeftScreen(character.id)}
      swipeRequirementType="position"
      swipeThreshold={100}
      preventSwipe={["up", "down"]}
    >
      <div
        onClick={(e) => onInteraction(character.id, e)}
        onTouchStart={(e) => onInteraction(character.id, e)}
        className={`${styles.card} ${flipped[character.id] ? styles.flipped : ''}`}
      >
        {/* 表面（本の表紙） */}
        <div
          style={{ backgroundImage: `url(${character.cover || ""})` }}
          className={styles.coverImage}
        ></div>
        {/* 裏面（本の内容） */}
        <div className={styles.content}>
          <h3 className={styles.title}>{character.title}</h3>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: character.content || "" }}
          ></div>
          <div className={styles.footer}>
            <p className={styles.date}>
              発売日: {new Date(character.published_at || "").toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </TinderCard>
  );
};