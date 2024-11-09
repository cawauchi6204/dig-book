"use client";
import axios from 'axios';
import Image from 'next/image';
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
  console.log("🚀 ~ Simple ~ data:", data)
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const swiped = (direction: string, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('/api/microCMS');
        setData(response.data.contents);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axiosのエラーが発生しました:', error);
        } else {
          console.error('Axios以外のエラーが発生しました:', error);
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
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {data.map((character) => (
          <TinderCard
            className="swipe"
            key={character.id}
            onSwipe={(dir) => swiped(dir, character.id)}
            onCardLeftScreen={() => outOfFrame(character.id)}
          >
            <div
              style={{ backgroundImage: "url(" + character.cover[0].url + ")" }}
              className="card"
            >
              <h3>{character.title}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      {lastDirection ? (
        <h2 className="infoText">You swiped {lastDirection}</h2>
      ) : (
        <h2 className="infoText"></h2>
      )}
    </div>
  );
}

export default Simple;
