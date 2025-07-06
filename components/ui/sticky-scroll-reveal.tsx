"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#000000", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #f97316, #eab308)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
      <motion.div
          animate={{
            backgroundColor: backgroundColors[activeCard % backgroundColors.length],
          }}
          className="relative flex min-h-[90vh] justify-center space-x-16 rounded-md p-20" // ⬅ увеличено пространство и высота
          ref={ref}
      >
        <div className="relative flex items-start px-6 max-w-3xl"> {/* ⬅ расширили текстовый блок */}
          <div>
            {content.map((item, index) => (
                <div key={item.title + index} className="my-40"> {/* ⬅ увеличено вертикальное расстояние */}
                  <motion.h2
                      initial={{opacity: 0}}
                      animate={{opacity: activeCard === index ? 1 : 0.3}}
                      className="text-4xl font-bold text-slate-100" // ⬅ увеличен размер заголовка
                  >
                    {item.title}
                  </motion.h2>
                  <motion.p
                      initial={{opacity: 0}}
                      animate={{opacity: activeCard === index ? 1 : 0.3}}
                      className="mt-10 max-w-2xl text-xl text-slate-300" // ⬅ увеличен текст
                  >
                    {item.description}
                  </motion.p>
                </div>
            ))}
            <div className="h-60"/>
            {/* ⬅ добавлен отступ снизу */}
          </div>
        </div>

        <div
            style={{background: backgroundGradient}}
            className={cn(
                "sticky top-20 hidden h-[500px] w-[400px] overflow-hidden rounded-xl bg-white shadow-xl lg:block", // ⬅ увеличен размер карточки
                contentClassName,
            )}
        >
          {content[activeCard].content ?? null}
        </div>
      </motion.div>

  );
};
