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
    <div>
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
              style={{ backgroundImage: `url(${character.cover[0].url})` }}
              className="relative w-full h-full rounded-[20px] bg-cover bg-center shadow-lg"
            >
              <h3 className="absolute bottom-0 m-4 text-white font-bold text-2xl">
                {character.title}
              </h3>
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
