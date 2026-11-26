"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 环境音开关 —— 用 Web Audio API 合成柔和的风与三音垫，
 * 零外部素材；默认关闭，点击才创建音频上下文（避免自动播放）。
 */
export function AudioToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const build = () => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0.06;
    master.connect(ctx.destination);

    // 柔和三音垫
    [196, 247, 294].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.02;
      const lg = ctx.createGain();
      lg.gain.value = 0.35;
      lfo.connect(lg);
      lg.connect(g.gain);
      osc.connect(g);
      g.connect(master);
      osc.start();
      lfo.start();
    });

    // 微风：白噪声 + 低通
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.12;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    const ng = ctx.createGain();
    ng.gain.value = 0.15;
    noise.connect(lp);
    lp.connect(ng);
    ng.connect(master);
    noise.start();

    ctxRef.current = ctx;
  };

  const toggle = async () => {
    if (!ctxRef.current) build();
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (on) {
      await ctx.suspend();
      setOn(false);
    } else {
      await ctx.resume();
      setOn(true);
    }
  };

  useEffect(
    () => () => {
      ctxRef.current?.close().catch(() => {});
    },
    []
  );

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "关闭环境音" : "开启环境音"}
      className={cn(
        "fixed right-6 top-6 z-50 grid h-9 w-9 place-items-center rounded-full border-2 border-pencil bg-card transition-colors",
        on ? "text-pencil" : "text-graphite hover:text-pencil"
      )}
    >
      {on ? <Volume2 size={16} strokeWidth={1.8} /> : <VolumeX size={16} strokeWidth={1.8} />}
    </button>
  );
}
