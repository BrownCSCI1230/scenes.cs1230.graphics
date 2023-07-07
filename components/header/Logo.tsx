"use client";

import { useRef } from "react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const mouseEnter = (ref: React.RefObject<HTMLDivElement>) => {
  return () => {
    if (!ref.current || ref.current.className.includes(after)) return;
    ref.current.className = ref.current.className.replace(before, after);
    setTimeout(() => {
      if (!ref.current) return;
      ref.current.className = ref.current.className.replace(after, before);
    }, 500);
  };
};

const before =
  " before:transition-none after:transition-none before:translate-y-[-100%] after:translate-y-0";
const after =
  " before:transition-transform after:transition-transform before:translate-y-0 after:translate-y-[100%]";
const logoCharClassName =
  "relative flex-1 h-full before:absolute before:inset-y-[7px] before:ml-1 after:absolute after:inset-y-[7px] after:ml-1 before:duration-500 after:duration-500 before:ease-in-out after:ease-in-out" +
  before;
const logoFont = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

export default function LogoNew() {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const cRef = useRef(null);
  const dRef = useRef(null);
  const eRef = useRef(null);
  const fRef = useRef(null);

  return (
    <Link
      className={
        logoFont.className + " flex h-full w-[138px] text-white text-[34.6px]"
      }
      href="https://cs1230.graphics"
      target="_blank"
      aria-label="home"
    >
      <div
        className={
          logoCharClassName +
          " bg-[#e54141] before:content-['C'] after:content-['C']"
        }
        ref={aRef}
        onMouseEnter={mouseEnter(aRef)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#fa8212] before:content-['S'] after:content-['S']"
        }
        ref={bRef}
        onMouseEnter={mouseEnter(bRef)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#f0c61b] before:content-['1'] after:content-['1']"
        }
        ref={cRef}
        onMouseEnter={mouseEnter(cRef)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#4db234] before:content-['2'] after:content-['2']"
        }
        ref={dRef}
        onMouseEnter={mouseEnter(dRef)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#2d93ca] before:content-['3'] after:content-['3']"
        }
        ref={eRef}
        onMouseEnter={mouseEnter(eRef)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#5d4bd1] before:content-['0'] after:content-['0']"
        }
        ref={fRef}
        onMouseEnter={mouseEnter(fRef)}
      ></div>
    </Link>
  );
}
