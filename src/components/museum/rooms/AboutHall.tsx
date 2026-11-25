"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

interface AboutHallProps {
  config: any;
  isActive: boolean;
  onEnter: () => void;
}

export function AboutHall({ config, isActive, onEnter }: AboutHallProps) {
  const groupRef = useRef<THREE.Group>(null);
  const portraitsRef = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const meta = config?.meta || {};

    // === 展厅结构：长廊式 ===
    // 地板
    const floorGeometry = new THREE.BoxGeometry(25, 0.2, 12);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0d1117,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.4,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(-10, 0, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // 天花板
    const ceiling = new THREE.Mesh(floorGeometry, floorMaterial);
    ceiling.position.set(-10, 6, 0);
    group.add(ceiling);

    // 左右墙壁
    const wallGeometry = new THREE.BoxGeometry(25, 6, 0.2);
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x161b22,
      metalness: 0.1,
      roughness: 0.4,
    });

    const wallBack = new THREE.Mesh(wallGeometry, wallMaterial);
    wallBack.position.set(-10, 3, -6);
    wallBack.receiveShadow = true;
    group.add(wallBack);

    const wallFront = new THREE.Mesh(wallGeometry, wallMaterial);
    wallFront.position.set(-10, 3, 6);
    wallFront.receiveShadow = true;
    group.add(wallFront);

    // === 肖像画框 (展示技能/经历卡片) ===
    const frameGeometry = new THREE.BoxGeometry(3.5, 2.5, 0.15);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b7355,
      metalness: 0.5,
      roughness: 0.3,
      clearcoat: 0.5,
    });

    const portraitData = [
      { title: "全栈开发工程师", desc: meta.title || "专注于构建可扩展的 Web 应用", icon: "💻", color: 0x00d4ff },
      { title: "技术栈广度", desc: "React, Node.js, Go, Python, Rust...", icon: "🛠️", color: 0xff6b6b },
      { title: "开源贡献者", desc: "热爱分享，活跃于 GitHub 社区", icon: "🌟", color: 0xffd700 },
      { title: "持续学习者", desc: "探索 AI、WebGL、分布式系统前沿", icon: "📚", color: 0x00ff88 },
    ];

    portraitData.forEach((data, i) => {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      const x = -19 + i * 6.5;
      frame.position.set(x, 2.8, 5.2);
      frame.rotation.y = -0.15;
      frame.castShadow = true;
      group.add(frame);
      portraitsRef.current.push(frame);

      // 画框内的发光内容平面
      const contentGeometry = new THREE.PlaneGeometry(3.2, 2.2);
      const contentMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const content = new THREE.Mesh(contentGeometry, contentMaterial);
      content.position.set(x, 2.8, 5.35);
      content.rotation.y = -0.15;
      group.add(content);
    });

    // === 中央全息投影台 ===
    const pedestalGeometry = new THREE.CylinderGeometry(1.5, 2, 1.2, 16);
    const pedestalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1a,
      metalness: 0.8,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.set(-10, 0.6, 0);
    pedestal.castShadow = true;
    group.add(pedestal);

    // 全息投影圆柱
    const holoGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32, 1, true);
    const holoMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const holoCylinder = new THREE.Mesh(holoGeometry, holoMaterial);
    holoCylinder.position.set(-10, 3.2, 0);
    group.add(holoCylinder);

    // === 顶部线性灯带 ===
    for (let i = 0; i < 10; i++) {
      const lightGeometry = new THREE.BoxGeometry(2, 0.05, 0.2);
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.position.set(-19 + i * 4, 5.8, 0);
      group.add(light);
    }

    // 入口动画
    if (isActive) {
      group.position.x = -30;
      gsap.to(group.position, {
        x: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    // 清理
    return () => {
      floorGeometry.dispose();
      floorMaterial.dispose();
      wallGeometry.dispose();
      wallMaterial.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      pedestalGeometry.dispose();
      pedestalMaterial.dispose();
      holoGeometry.dispose();
      holoMaterial.dispose();
      portraitsRef.current.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
    };
  }, [isActive, config, onEnter]);

  // 动画循环
  useFrame((_, delta) => {
    timeRef.current += delta;

    const group = groupRef.current;
    if (!group) return;

    // 全息圆柱旋转
    const holo = group.children.find(
      (c): c is THREE.Mesh => c instanceof THREE.Mesh && c.geometry?.type === "CylinderGeometry" && (c.material as THREE.MeshBasicMaterial)?.transparent
    );
    if (holo) {
      holo.rotation.y += delta * 0.1;
      (holo.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(timeRef.current * 2) * 0.03;
    }

    // 基座发光脉动
    const pedestalMesh = group.children.find(
      (c): c is THREE.Mesh => c instanceof THREE.Mesh && c.geometry?.type === "CylinderGeometry" && !(c.material as THREE.MeshBasicMaterial)?.transparent
    );
    if (pedestalMesh && (pedestalMesh.material as THREE.MeshPhysicalMaterial).emissive) {
      (pedestalMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.1 + Math.sin(timeRef.current * 1.5) * 0.05;
    }

    // 顶部灯带流动
    group.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.geometry?.type === "BoxGeometry" && child.position.y > 5) {
        (child.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(timeRef.current * 3 + i) * 0.4;
      }
    });
  });

  // HTML 内容需要在渲染时返回，不能在 useEffect 中添加到 group
  const meta = config?.meta || {};
  const portraitData = [
    { title: "全栈开发工程师", desc: meta.title || "专注于构建可扩展的 Web 应用", icon: "💻", color: 0x00d4ff },
    { title: "技术栈广度", desc: "React, Node.js, Go, Python, Rust...", icon: "🛠️", color: 0xff6b6b },
    { title: "开源贡献者", desc: "热爱分享，活跃于 GitHub 社区", icon: "🌟", color: 0xffd700 },
    { title: "持续学习者", desc: "探索 AI、WebGL、分布式系统前沿", icon: "📚", color: 0x00ff88 },
  ];

  return (
    <group ref={groupRef}>
      {/* 肖像画框 HTML 标签 - 技能卡片 */}
      {portraitData.map((data, i) => {
        const x = -19 + i * 6.5;
        return (
          <Html
            key={`portrait-${i}`}
            transform
            position={[x, 2.8, 5.4]}
            rotation={[0, -0.15, 0]}
            style={{ pointerEvents: "auto", transformStyle: "preserve-3d" }}
            className="pointer-events-auto"
            occlude
          >
            <div
              className="w-72 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={onEnter}
            >
              <div className="text-4xl mb-2">{data.icon}</div>
              <h3 className="font-bold text-white text-lg mb-1">{data.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{data.desc}</p>
            </div>
          </Html>
        );
      })}

      {/* 个人信息全息文本 */}
      <Html
        transform
        position={[-10, 3.2, 0]}
        style={{ pointerEvents: "none" }}
        className="pointer-events-none"
        occlude
      >
        <div className="text-center w-64">
          <div className="text-primary text-2xl font-mono mb-2 tracking-widest animate-pulse">PROFILE</div>
          <h2 className="text-3xl font-bold text-white mb-1">{meta.name || "开发者"}</h2>
          <p className="text-primary text-lg mb-4">{meta.title || "Full Stack Developer"}</p>
          <div className="flex justify-center gap-4 text-sm text-white/60">
            <span>{meta.location || "北京, 中国"}</span>
            <span>{meta.email || "contact@example.com"}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}