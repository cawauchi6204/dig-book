"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { Book } from "../../types/Book";

function Simple() {
  const [data, setData] = useState<Book[]>([]);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const swiped = (direction: string, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);

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
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-10">
        {data.map((character) => (
          <TinderCard
            className="absolute w-full h-full"
            key={character.id}
            onSwipe={(dir) => swiped(dir, character.id)}
            onCardLeftScreen={() => outOfFrame(character.id)}
          >
            <div
              onClick={(e) => handleInteraction(character.id, e)}
              onTouchStart={(e) => handleInteraction(character.id, e)}
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
        ))}
      </div>
      {lastDirection && (
        <div className="w-full flex justify-center mt-4">
          <span className="px-4 py-2 bg-white/80 rounded-full text-gray-700 shadow-md animate-popup">
            {lastDirection === "right"
              ? "保存しました！"
              : lastDirection === "up"
              ? "リンクを開きます"
              : `${lastDirection}にスワイプしました`}
          </span>
        </div>
      )}
    </div>
  );
}

export default Simple;
