"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
                                  text,
                                  duration,
                                }: {
  text: string;
  duration?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
      <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 300 100"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
          className="select-none"
      >
        <defs>
          {/* Яркий оранжевый градиент */}
          <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#facc15" /> {/* yellow-400 */}
            <stop offset="50%" stopColor="#f97316" /> {/* orange-500 */}
            <stop offset="100%" stopColor="#c2410c" /> {/* orange-700 */}
          </linearGradient>

          {/* Большой радиус маски */}
          <motion.radialGradient
              id="revealMask"
              gradientUnits="userSpaceOnUse"
              r="35%"
              initial={{ cx: "50%", cy: "50%" }}
              animate={maskPosition}
              transition={{ duration: duration ?? 0.3, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id="textMask">
            <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#revealMask)"
            />
          </mask>
        </defs>

        {/* Тень/обводка всегда видна */}
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="#f97316" // orange-500
            strokeWidth="1.5"
            className="fill-white font-[helvetica] text-7xl font-bold dark:fill-neutral-800"
            style={{
              opacity: hovered ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}
        >
          {text}
        </text>

        {/* Градиент по маске — только при наведении */}
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#textGradient)"
            stroke="url(#textGradient)"
            strokeWidth="1"
            mask="url(#textMask)"
            className="font-[helvetica] text-7xl font-bold"
            style={{ pointerEvents: "none" }}
        >
          {text}
        </text>
      </svg>
  );
};
