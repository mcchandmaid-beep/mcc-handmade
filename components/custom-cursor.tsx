"use client";

import { useEffect, useRef, useState } from "react";

type CursorType = "default" | "view" | "discover" | "tone" | "link";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<{
    type: CursorType;
    text?: string;
    visible: boolean;
  }>({
    type: "default",
    visible: false,
  });

  useEffect(() => {
    const desktopQuery = window.matchMedia("(pointer: fine) and (min-width: 901px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktopQuery.matches || reducedMotionQuery.matches) return;

    let pointerX = -100;
    let pointerY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let rafId: number | null = null;

    const animate = () => {
      cursorX += (pointerX - cursorX) * 0.28;
      cursorY += (pointerY - cursorY) * 0.28;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          "translate3d(" + cursorX + "px, " + cursorY + "px, 0)";
      }

      if (Math.abs(pointerX - cursorX) > 0.2 || Math.abs(pointerY - cursorY) > 0.2) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!desktopQuery.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };

    const handleMouseOver = (event: MouseEvent) => {
      if (!desktopQuery.matches) return;
      const target = (event.target as HTMLElement | null)?.closest(
        ".collection-piece-card__media img, .product-gallery__image-button img, .domino-card__image, .editorial-hero__image, .editorial-hero__secondary-photo"
      );

      if (!target) {
        setCursorState((state) => ({ ...state, visible: false }));
        return;
      }

      setCursorState({
        type: "view",
        visible: true,
      });
    };

    const handleMouseLeave = () => {
      setCursorState((state) => ({ ...state, visible: false }));
    };

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setCursorState((state) => ({ ...state, visible: false }));
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    desktopQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      desktopQuery.removeEventListener("change", handleMediaChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={
        "luxury-cursor luxury-cursor--" +
        cursorState.type +
        (cursorState.visible ? " luxury-cursor--visible" : "")
      }
      ref={cursorRef}
    >
      <div className="luxury-cursor__ring">
        <span className="luxury-cursor__text">
          {cursorState.text ||
            (cursorState.type === "view"
              ? "VIEW"
              : cursorState.type === "discover"
                ? "DISCOVER"
                : "")}
        </span>
      </div>
      <div className="luxury-cursor__dot" />
    </div>
  );
}
