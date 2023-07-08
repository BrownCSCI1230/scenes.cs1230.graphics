"use client";

import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";

type LogoState = "CS1230" | "SCENES";

const mouseEnter = (ref: React.RefObject<HTMLDivElement>, state: LogoState) => {
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
  "relative flex-1 h-full before:absolute before:inset-y-[7px] before:ml-[4.7px] after:absolute after:inset-y-[7px] after:ml-[4.7px] before:duration-500 after:duration-500 before:ease-in-out after:ease-in-out" +
  before;
const logoFont = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

export default function LogoNew() {
  const [logoState, setLogoState] = useState<LogoState>("CS1230");
  const aRef = useRef(null);
  const bRef = useRef(null);
  const cRef = useRef(null);
  const dRef = useRef(null);
  const eRef = useRef(null);
  const fRef = useRef(null);

  const refs = [aRef, bRef, cRef, dRef, eRef, fRef];

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
          " bg-[#e54141] before:content-['C'] after:content-['S']"
        }
        ref={aRef}
        onMouseEnter={mouseEnter(aRef, logoState)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#fa8212] before:content-['S'] after:content-['C']"
        }
        ref={bRef}
        onMouseEnter={mouseEnter(bRef, logoState)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#f0c61b] before:content-['1'] after:content-['E']"
        }
        ref={cRef}
        onMouseEnter={mouseEnter(cRef, logoState)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#4db234] before:content-['2'] after:content-['N']"
        }
        ref={dRef}
        onMouseEnter={mouseEnter(dRef, logoState)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#2d93ca] before:content-['3'] after:content-['E']"
        }
        ref={eRef}
        onMouseEnter={mouseEnter(eRef, logoState)}
      ></div>
      <div
        className={
          logoCharClassName +
          " bg-[#5d4bd1] before:content-['0'] after:content-['S']"
        }
        ref={fRef}
        onMouseEnter={mouseEnter(fRef, logoState)}
      ></div>
    </Link>
  );
}
