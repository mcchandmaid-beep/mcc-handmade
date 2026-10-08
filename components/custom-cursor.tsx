"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorState, setCursorState] = useState<{
    type: "default" | "view" | "discover" | "tone" | "link";
    text?: string;
    visible: boolean;
  }>({
    type: "default",
    visible: false,
  });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }));
      }
    };

    const onMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (target) {
        const type = target.getAttribute("data-cursor") as any;
        const text = target.getAttribute("data-cursor-text") || undefined;
        setCursorState({ type, text, visible: true });
        return;
      }

      const isClickable = (e.target as HTMLElement)?.closest("a, button, [role='button']");
      if (isClickable) {
        setCursorState({ type: "link", visible: true });
        return;
      }

      setCursorState({ type: "default", visible: true });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    // Smooth lerp animation loop
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [cursorState.visible]);

  return (
    <div
      aria-hidden="true"
      className={`luxury-cursor luxury-cursor--${cursorState.type} ${cursorState.visible ? "luxury-cursor--visible" : ""}`}
      ref={cursorRef}
    >
      <div className="luxury-cursor__ring">
        <span className="luxury-cursor__text" ref={textRef}>
          {cursorState.text || (cursorState.type === "view" ? "VIEW" : cursorState.type === "discover" ? "DISCOVER" : "")}
        </span>
      </div>
      <div className="luxury-cursor__dot" ref={dotRef} />
    </div>
  );
}
