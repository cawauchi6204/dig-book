import { useState } from "react";

export function useFlipCard() {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

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
    // クリックイベントでカードをフリップ
    handleClick(id);
  };

  return { flipped, handleInteraction };
}
