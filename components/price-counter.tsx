"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { formatPrice } from "@/lib/format";

export function PriceCounter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => formatPrice(Math.round(v)));
  const [text, setText] = useState(formatPrice(value));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
    const unsub = display.on("change", (v) => setText(v));
    return () => unsub();
  }, [value, spring, display]);

  return (
    <motion.span
      ref={ref}
      key={value}
      className="tabular-nums"
      initial={{ scale: 1.05 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.span>
  );
}
