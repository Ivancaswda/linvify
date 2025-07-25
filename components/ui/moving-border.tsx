"use client";
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
}

export function Button({
                         borderRadius = "1.75rem",
                         children,
                         as: Component = "button",
                         containerClassName,
                         borderClassName,
                         duration,
                         className,
                         ...otherProps
                       }: ButtonProps) {
  return (
      <Component
          className={cn(
              "relative h-10 w-40 overflow-hidden bg-transparent p-[2px] text-lg",
              containerClassName,
          )}
          style={{ borderRadius }}
          {...otherProps}
      >
        <div
            className="absolute inset-0"
            style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        >
          <MovingBorder duration={duration} rx="30%" ry="30%">
            <div
                className={cn(
                    "h-20 w-20 bg-[radial-gradient(orange_40%,transparent_60%)] opacity-[0.9]",
                    borderClassName,
                )}
            />
          </MovingBorder>
        </div>

        <div
            className={cn(
                "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
                className,
            )}
            style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        >
          {children}
        </div>
      </Component>
  );
}

interface MovingBorderProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

export const MovingBorder = ({
                               children,
                               duration = 3000,
                               rx,
                               ry,
                               ...otherProps
                             }: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val: number) =>
      pathRef.current?.getPointAtLength(val)?.x,
  );
  const y = useTransform(progress, (val: number) =>
      pathRef.current?.getPointAtLength(val)?.y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
      <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute h-full w-full"
            width="100%"
            height="100%"
            {...otherProps}
        >
          <rect
              fill="none"
              width="100%"
              height="100%"
              rx={rx}
              ry={ry}
              ref={pathRef}
          />
        </svg>
        <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "inline-block",
              transform,
            }}
        >
          {children}
        </motion.div>
      </>
  );
};
