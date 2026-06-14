"use client";

import { useEffect, useRef } from "react";

export function AtmosphericGradient() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!overlayRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Update background with custom radial gradients tracking cursor coordinates
      overlayRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #b1f032 0%, transparent 40%), radial-gradient(circle at ${100 - (x * 100)}% ${100 - (y * 100)}%, #1a3c34 0%, transparent 40%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-300 ease-out"
      style={{
        background: "radial-gradient(circle at 30% 20%, #b1f032 0%, transparent 40%), radial-gradient(circle at 70% 80%, #1a3c34 0%, transparent 40%)",
      }}
    />
  );
}
