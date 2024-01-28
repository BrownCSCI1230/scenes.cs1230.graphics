"use client";

import { cn } from "@/lib/utils";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { useRef } from "react";

const before = " before:translate-y-[-100%] after:translate-y-0";
const after = " before:translate-y-0 after:translate-y-[100%]";
const logoCharClassName = cn(
  "relative flex-1 h-full before:absolute before:inset-y-[7px] before:ml-[4.7px] after:absolute after:inset-y-[8px] after:ml-[4.7px] before:duration-500 after:duration-500 before:ease-in-out after:ease-in-out before:transition-transform after:transition-transform",
  before,
);
const logoFont = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

export const Logo = () => {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLDivElement>(null);
  const dRef = useRef<HTMLDivElement>(null);
  const eRef = useRef<HTMLDivElement>(null);
  const fRef = useRef<HTMLDivElement>(null);

  const refs = [aRef, bRef, cRef, dRef, eRef, fRef];

  const hoveredIndex = useRef<number>();
  const leaveTimeout = useRef<NodeJS.Timeout>();

  const mouseEnter = (index: number) => {
    return () => {
      leaveTimeout.current && clearTimeout(leaveTimeout.current);
      if (hoveredIndex.current === undefined) {
        hoveredIndex.current = index;
        refs.forEach((ref, i) => {
          setTimeout(
            () => {
              if (!ref.current) return;
              ref.current.className = ref.current.className.replace(
                before,
                after,
              );
            },
            Math.abs(i - index) * 50,
          );
        });
      }
    };
  };

  const mouseLeave = () => {
    if (hoveredIndex.current !== undefined) {
      leaveTimeout.current = setTimeout(() => {
        refs.forEach((ref, i) => {
          setTimeout(
            () => {
              if (!ref.current) return;
              ref.current.className = ref.current.className.replace(
                after,
                before,
              );
            },
            Math.abs(i - hoveredIndex.current!) * 50,
          );
        });
        hoveredIndex.current = undefined;
      }, 200);
    }
  };
  return (
    <Link
      href="https://cs1230.graphics/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        logoFont.className,
        "flex h-16 w-[138px] shrink-0 overflow-hidden text-[34.6px] text-white",
      )}
      onMouseLeave={mouseLeave}
    >
      <div
        className={cn(
          logoCharClassName,
          "bg-[#e54141] before:content-['C'] after:content-['S']",
        )}
        ref={aRef}
        onMouseEnter={mouseEnter(0)}
      ></div>
      <div
        className={cn(
          logoCharClassName,
          "bg-[#fa8212] before:content-['S'] after:content-['C']",
        )}
        ref={bRef}
        onMouseEnter={mouseEnter(1)}
      ></div>
      <div
        className={cn(
          logoCharClassName,
          "bg-[#f0c61b] before:content-['1'] after:content-['E']",
        )}
        ref={cRef}
        onMouseEnter={mouseEnter(2)}
      ></div>
      <div
        className={cn(
          logoCharClassName,
          "bg-[#4db234] before:content-['2'] after:content-['N']",
        )}
        ref={dRef}
        onMouseEnter={mouseEnter(3)}
      ></div>
      <div
        className={cn(
          logoCharClassName,
          "bg-[#2d93ca] before:content-['3'] after:content-['E']",
        )}
        ref={eRef}
        onMouseEnter={mouseEnter(4)}
      ></div>
      <div
        className={cn(
          logoCharClassName,
          "bg-[#5d4bd1] before:content-['0'] after:content-['S']",
        )}
        ref={fRef}
        onMouseEnter={mouseEnter(5)}
      ></div>
    </Link>
  );
};
