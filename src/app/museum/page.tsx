"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// 动态导入 MuseumScene (SSR 禁用)
const MuseumScene = dynamic(
  () => import("@/components/museum/MuseumScene").then((mod) => mod.MuseumScene),
  { ssr: false, loading: () => <div className="h-screen flex items-center justify-center bg-black text-white">加载数字展厅...</div> }
);

export default function MuseumPage() {
  const [showMuseum, setShowMuseum] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 背景氛围 */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#1a1f3a] to-[#2d1b4e]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />

      {/* 入口页面 */}
      <AnimatePresence mode="wait">
        {!showMuseum && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 flex flex-col items-center justify-center z-10 p-8"
          >
            <div className="text-center max-w-3xl">
              {/* Logo/标题 */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-2xl">
                    🏛️
                  </div>
                  <div className="text-left">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-primary to-pink-400 bg-clip-text text-transparent leading-tight">
                      数字展厅
                    </h1>
                    <p className="text-white/60 text-lg mt-2">Digital Museum Portfolio</p>
                  </div>
                </div>
              </motion.div>

              {/* 描述 */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="mb-12 text-center"
              >
                <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                  如同游览博物馆般探索我的技术历程。<br />
                  四大展厅，沉浸式 3D 空间，全息投影与星座可视化。
                </p>
              </motion.div>

              {/* 展厅预览卡片 */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                {[
                  { icon: "🏛️", title: "入口大厅", desc: "水晶吊灯、大理石地板、粒子流动" },
                  { icon: "👤", title: "关于我廊", desc: "肖像画框、全息投影、个人档案" },
                  { icon: "📦", title: "项目画廊", desc: "悬浮立方体、聚光灯、玻璃材质" },
                  { icon: "✨", title: "技能星座", desc: "星系分布、引力动画、连接线网" },
                ].map((hall, i) => (
                  <div
                    key={hall.title}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 cursor-pointer"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="text-4xl mb-3">{hall.icon}</div>
                    <h3 className="font-bold text-white text-lg mb-1">{hall.title}</h3>
                    <p className="text-white/50 text-sm">{hall.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* 进入按钮 */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="mb-8"
              >
                <Button
                  size="lg"
                  className="px-12 py-4 text-lg bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 shadow-lg shadow-primary/25"
                  onClick={() => setShowMuseum(true)}
                >
                  进入展厅探索 →
                </Button>
              </motion.div>

              {/* 提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-white/40 text-sm"
              >
                <p>💡 提示：进入后使用底部导航切换展厅，鼠标拖拽旋转视角，滚轮缩放</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 博物馆场景 */}
      <AnimatePresence mode="wait">
        {showMuseum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20"
          >
            <MuseumScene />
            {/* 返回按钮 */}
            <div className="fixed top-6 left-6 z-50">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowMuseum(false)}
              >
                ← 返回
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}