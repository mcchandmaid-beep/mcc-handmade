"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";

interface SculpturalMomentProps {
  locale: Locale;
}

export function SculpturalMoment({ locale }: SculpturalMomentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isVisible = false;
    let animationFrameId: number | null = null;
    let time = 0;
    let scrollOffset = 0;
    let mouseInfluence = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const startLoop = () => {
      if (prefersReducedMotion || animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : false;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onScroll = () => {
      if (!isVisible) return;
      const rect = container.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      scrollOffset = Math.max(0, Math.min(1, progress));
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const rect = container.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouseInfluence.targetX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseInfluence.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight || 480;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // If reduced motion, render a single frame on resize
      if (prefersReducedMotion) {
        drawFrame();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const drawFrame = () => {
      time += 0.007;

      // Smooth mouse dampening
      mouseInfluence.x += (mouseInfluence.targetX - mouseInfluence.x) * 0.05;
      mouseInfluence.y += (mouseInfluence.targetY - mouseInfluence.y) * 0.05;

      const width = container.clientWidth;
      const height = container.clientHeight || 480;

      ctx.clearRect(0, 0, width, height);

      // Draw multiple procedural sinusoidal drape contours
      const ribbonsCount = 14;
      const pointsCount = 70;

      ctx.lineWidth = 1;

      for (let r = 0; r < ribbonsCount; r++) {
        const ribbonProgress = r / ribbonsCount;
        const alpha = 0.08 + Math.sin(ribbonProgress * Math.PI) * 0.32;
        
        ctx.strokeStyle = `rgba(18, 18, 18, ${alpha})`;
        ctx.beginPath();

        for (let p = 0; p <= pointsCount; p++) {
          const u = p / pointsCount;
          const x = width * 0.12 + u * width * 0.76;
          
          // Complex organic wave representing fabric drape flow
          const baseY = height * 0.5;
          const wave1 = Math.sin(u * 3.5 + time + ribbonProgress * 2.2) * 55;
          const wave2 = Math.cos(u * 6.2 - time * 0.8 + scrollOffset * 3.0) * 28;
          const wave3 = Math.sin(u * 1.8 + ribbonProgress * 4.0) * 35;
          const mouseMod = mouseInfluence.y * 60 * Math.sin(u * Math.PI);
          
          const envelope = Math.sin(u * Math.PI); // Pin edges
          const y = baseY + (wave1 + wave2 + wave3 + mouseMod) * envelope * (0.8 + scrollOffset * 0.4);

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }
    };

    const render = () => {
      if (isVisible) {
        drawFrame();
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    };

    if (prefersReducedMotion) {
      drawFrame();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      aria-label="Signature Moment Sculptural"
      className="sculptural-moment"
      data-cursor="view"
      ref={containerRef}
    >
      <div className="sculptural-moment__top-bar">
        <span className="mono-label">[ {isArabic ? "دراسة بصرية نحتية" : "ÉTUDE SCULPTURALE · 01"} ]</span>
        <span className="mono-label">{isArabic ? "هندسة الانسياب الصامت" : "L’ARCHITECTURE DU DRAPÉ"}</span>
      </div>

      <div className="sculptural-moment__canvas-wrap">
        <canvas className="sculptural-moment__canvas" ref={canvasRef} />
        
        <div className="sculptural-moment__overlay" aria-hidden="true">
          <div className="sculptural-moment__headline">
            <span className="mono-label sculptural-moment__kicker">
              {isArabic ? "توازن الخطوط" : "CINÉTIQUE DU DRAPÉ"}
            </span>
            <p className="sculptural-moment__tag">
              {isArabic
                ? "موجة مستمرة منحوتة في هيبة الصمت، حيث تلتقي الخطوط بروح الأزياء المعاصرة."
                : "Une onde continue où la ligne architecturale sublime la liberté et la retenue du mouvement."}
            </p>
          </div>
          <div className="sculptural-moment__coords mono-label">
            <span>AXIS · ROTATION : 0.04°</span>
            <span>TENSION : MODÉRÉE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
