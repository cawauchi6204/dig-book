"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";

interface Image {
  id: string;
  cover: {
    url: string;
    height: number;
    width: number;
  }[];
  publishedAt: string;
  revisedAt: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

function Simple() {
  const [data, setData] = useState<Image[]>([]);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const swiped = (direction: string, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);

    // 右スワイプの場合、local storageに保存
    if (direction === "right") {
      const likedItems = JSON.parse(localStorage.getItem("likedItems") || "[]");
      const currentItem = data.find((item) => item.id === nameToDelete);
      if (
        currentItem &&
        !likedItems.some((item: Image) => item.id === currentItem.id)
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
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleInteraction = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    // タッチイベントの場合、タップとスワイプを区別するために時間とモーション量をチェック
    if (e.type === 'touchstart') {
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

        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd);
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
    <div className="h-screen overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto">
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
              className={`relative w-full h-full rounded-[20px] shadow-lg cursor-pointer transition-transform duration-700 preserve-3d ${
                flipped[character.id] ? 'rotate-y-180' : ''
              }`}
            >
              {/* 表面 */}
              <div
                style={{ backgroundImage: `url(${character.cover[0].url})` }}
                className="absolute w-full h-full rounded-[20px] bg-cover bg-center backface-hidden"
              >
                <h3 className="absolute bottom-0 m-4 text-white font-bold text-2xl">
                  {character.title}
                </h3>
              </div>
              
              {/* 裏面 */}
              <div className="absolute w-full h-full rounded-[20px] bg-white p-4 rotate-y-180 backface-hidden">
                <h3 className="font-bold text-xl mb-2">{character.title}</h3>
                <p className="text-gray-600">作成日: {new Date(character.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">更新日: {new Date(character.updatedAt).toLocaleDateString()}</p>
                {/* 必要に応じて他の情報を追加 */}
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      {lastDirection ? (
        <h2 className="w-full flex justify-center text-white animate-popup">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="w-full flex justify-center text-white animate-popup"></h2>
      )}
    </div>
  );
}

export default Simple;
