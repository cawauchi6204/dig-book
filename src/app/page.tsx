"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Book } from "../../types/Book";
import { BookCard } from "@/components/BookCard";
import { SwipeGuide } from "@/components/SwipeGuide";

function Simple() {
  const [data, setData] = useState<Book[]>([]);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const swiped = (direction: string, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);

    // 上スワイプの場合、リンク先に遷移
    if (direction === "up") {
      const currentItem = data.find((item) => item.id === nameToDelete);
      if (currentItem && currentItem.link) {
        window.open(currentItem.link, "_blank");
      }
    }
    // 右スワイプの場合、local storageに保存
    else if (direction === "right") {
      const likedItems = JSON.parse(localStorage.getItem("likedItems") || "[]");
      const currentItem = data.find((item) => item.id === nameToDelete);
      if (
        currentItem &&
        !likedItems.some((item: Book) => item.id === currentItem.id)
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
    // タッチイベントの場合、タップとスワイプを区別するために時間とモーション量をチェック
    if (e.type === "touchstart") {
      const touch = (e as React.TouchEvent).touches[0];
      const startTime = new Date().getTime();
      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTime = new Date().getTime();
        const endX = endEvent.changedTouches[0].clientX;
        const endY = endEvent.changedTouches[0].clientY;

        // 移動距離と時間を計算
        const moveX = Math.abs(endX - startX);
        const moveY = Math.abs(endY - startY);
        const timeDiff = endTime - startTime;

        // タップとみなす条件：
        // - 短時間（300ms以下）
        // - 小さな移動距離（10px以下）
        if (timeDiff < 300 && moveX < 10 && moveY < 10) {
          handleClick(id);
        }

        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    } else {
      // クリックの場合は通常通り処理
      handleClick(id);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/microCMS");
        setData(response.data.contents);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axiosのエラーが発生しました:", error);
        } else {
          console.error("Axios以外のエラーが発生しました:", error);
        }
      }
    };

    getData();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-6">
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
      </div>
      <SwipeGuide />
    </div>
  );
}

export default Simple;
