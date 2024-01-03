import React, { useState, useEffect } from "react";

const generateRandomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export default function Circle() {
  const [animate, setAnimate] = useState<"animate-ping-slow" | null>(null);
  const [innerW, setInnerW] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  /* 
    create an animation that is 
  */

  useEffect(() => {
    const intervalId = setInterval(() => {
      const x = generateRandomNumber(0, window.innerWidth - 50);
      const y = generateRandomNumber(0, window.innerHeight - 50);
      setPosition({ x, y });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`left-${position.x} top-${position.y} absolute h-[50px] w-[50px] rounded-full bg-blue-400`}></div>
  );
}
