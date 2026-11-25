"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  color?: string;
  lineColor?: string;
  maxDistance?: number;
  speed?: number;
  className?: string;
}

export function ParticleBackground({
  particleCount = 50,
  color = "#3b82f6",
  lineColor = "#3b82f6",
  maxDistance = 150,
  speed = 0.3,
  className,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 59, g: 130, b: 246 };
  };

  const { r, g, b } = useMemo(() => hexToRgb(color), [color]);
  const { r: lr, g: lg, b: lb } = useMemo(() => hexToRgb(lineColor), [lineColor]);

  // 初始化粒子
  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      color: `rgba(${r}, ${g}, ${b}, ${Math.random() * 0.5 + 0.1})`,
    }));
  }, [particleCount, speed, r, g, b]);

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // 更新并绘制粒子
    particlesRef.current.forEach((p) => {
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;

      // 绘制粒子
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // 绘制连线
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [maxDistance, lr, lg, lb]);

  // 初始化和清理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

  return <canvas ref={canvasRef} className={cn("fixed inset-0 z-0 pointer-events-none", className)} />;
}