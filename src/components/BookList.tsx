"use client";
import React, { useState, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { Database } from "../../types/supabasetype";

type Props = {
  initialBooks: Database["public"]["Tables"]["books"]["Row"][];
  onEmpty: () => Promise<Database["public"]["Tables"]["books"]["Row"][]>;
};

export function BookList({ initialBooks, onEmpty }: Props) {
  const [data, setData] = useState(initialBooks);

  useEffect(() => {
    setData(initialBooks);
  }, [initialBooks]);

  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const swiped = (direction: string, nameToDelete: string) => {
    if (direction === "up") {
      const currentItem = data.find((item) => item.isbn === nameToDelete);
      if (currentItem && currentItem.link) {
        window.open(currentItem.link, "_blank");
      }
    } else if (direction === "right") {
      const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]");
      const currentItem = data.find((item) => item.isbn === nameToDelete);
      if (
        currentItem &&
        !likedBooks.some(
          (item: Database["public"]["Tables"]["books"]["Row"]) =>
            item.isbn === currentItem.isbn
        )
      ) {
        likedBooks.push(currentItem);
        localStorage.setItem("likedBooks", JSON.stringify(likedBooks));
      }
    }
  };

  const outOfFrame = async (name: string) => {
    console.log(name + " left the screen!");
    
    const nextData = data.filter(item => item.isbn !== name);
    setData(nextData);

    if (nextData.length === 0) {
      try {
        const newBooks = await onEmpty();
        setData(newBooks);
      } catch (error) {
        console.error('新しい本の取得に失敗しました:', error);
      }
    }
  };

  const handleClick = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInteraction = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (e.type === "touchstart") {
      const touch = (e as React.TouchEvent).touches[0];
      const startTime = new Date().getTime();
      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTime = new Date().getTime();
        const endX = endEvent.changedTouches[0].clientX;
        const endY = endEvent.changedTouches[0].clientY;

        const moveX = Math.abs(endX - startX);
        const moveY = Math.abs(endY - startY);
        const timeDiff = endTime - startTime;

        if (timeDiff < 300 && moveX < 10 && moveY < 10) {
          handleClick(id);
        }

        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    } else {
      handleClick(id);
    }
  };

  return (
    <>
      {data.map((character) => (
        <BookCard
          key={character.isbn}
          character={character}
          flipped={flipped}
          onSwipe={swiped}
          onCardLeftScreen={outOfFrame}
          onInteraction={handleInteraction}
        />
      ))}
    </>
  );
}
