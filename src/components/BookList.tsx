"use client";
import React, { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { SwipeGuide } from "@/components/SwipeGuide";
import { Database } from "../../database.types";

type Props = {
  initialBooks: Database["public"]["Tables"]["books"]["Row"][];
};

export function BookList({ initialBooks }: Props) {
  const [data] = useState(initialBooks);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const swiped = (direction: string, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);

    if (direction === "up") {
      const currentItem = data.find((item) => item.id === nameToDelete);
      if (currentItem && currentItem.link) {
        window.open(currentItem.link, "_blank");
      }
    } else if (direction === "right") {
      const likedItems = JSON.parse(localStorage.getItem("likedItems") || "[]");
      const currentItem = data.find((item) => item.id === nameToDelete);
      if (
        currentItem &&
        !likedItems.some(
          (item: Database["public"]["Tables"]["books"]["Row"]) =>
            item.id === currentItem.id
        )
      ) {
        likedItems.push(currentItem);
        localStorage.setItem("likedItems", JSON.stringify(likedItems));
      }
    }
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
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
          key={character.id}
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
