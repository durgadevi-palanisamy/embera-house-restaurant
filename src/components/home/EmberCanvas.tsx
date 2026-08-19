"use client";

import { useEffect, useRef } from "react";

export default function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Create Ember Particles
    const particleCount = 45;
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxLife: number;
      life: number;
      color: string;
    }[] = [];

    const colors = [
      "rgba(200, 110, 69, ", // Terracotta
      "rgba(211, 185, 141, ", // Champagne Gold
      "rgba(235, 130, 60, ",  // Warm Ember
      "rgba(247, 242, 233, ", // Warm Ivory spark
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        size: Math.random() * 2.5 + 0.8,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        maxLife: Math.random() * 300 + 200,
        life: Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.life++;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.3;

        // Fade in and out
        const currentOpacity =
          p.life < 50
            ? (p.life / 50) * p.opacity
            : (1 - p.life / p.maxLife) * p.opacity;

        if (p.life >= p.maxLife || p.y < -20) {
          p.life = 0;
          p.x = Math.random() * width;
          p.y = height + 20;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, currentOpacity)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#C86E45";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 w-full h-full opacity-70"
    />
  );
}
