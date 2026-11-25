"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import { Code2, Wrench, Star, BookOpen } from "lucide-react";

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

    // === 展厅结构：长廊式 ===
    const floorGeometry = new THREE.BoxGeometry(25, 0.2, 12);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x14110c,
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.3,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(-10, 0, 0);
    floor.receiveShadow = true;
    group.add(floor);

    const ceiling = new THREE.Mesh(floorGeometry, floorMaterial);
    ceiling.position.set(-10, 6, 0);
    group.add(ceiling);

    // 左右墙
    const wallGeometry = new THREE.BoxGeometry(25, 6, 0.2);
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1c1813,
      metalness: 0.05,
      roughness: 0.55,
    });
    const wallBack = new THREE.Mesh(wallGeometry, wallMaterial);
    wallBack.position.set(-10, 3, -6);
    wallBack.receiveShadow = true;
    group.add(wallBack);

    const wallFront = new THREE.Mesh(wallGeometry, wallMaterial);
    wallFront.position.set(-10, 3, 6);
    wallFront.receiveShadow = true;
    group.add(wallFront);

    // === 肖像画框（铜边）===
    const frameGeometry = new THREE.BoxGeometry(3.5, 2.5, 0.15);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a6a3b,
      metalness: 0.65,
      roughness: 0.3,
      clearcoat: 0.5,
    });
    const portraitColors = [0xb5894f, 0x4e7c74, 0xfff3d9, 0x8a6a3b];
    portraitColors.forEach((color, i) => {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      const x = -19 + i * 6.5;
      frame.position.set(x, 2.8, 5.2);
      frame.rotation.y = -0.15;
      frame.castShadow = true;
      group.add(frame);
      portraitsRef.current.push(frame);

      // 画框内发光内容
      const contentGeometry = new THREE.PlaneGeometry(3.2, 2.2);
      const contentMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
      });
      const content = new THREE.Mesh(contentGeometry, contentMaterial);
      content.position.set(x, 2.8, 5.35);
      content.rotation.y = -0.15;
      group.add(content);
    });

    // === 中央全息基座 ===
    const pedestalGeometry = new THREE.CylinderGeometry(1.5, 2, 1.2, 16);
    const pedestalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0c0a08,
      metalness: 0.8,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0,
      emissive: 0xb5894f,
      emissiveIntensity: 0.15,
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.set(-10, 0.6, 0);
    pedestal.castShadow = true;
    group.add(pedestal);

    // 全息投影柱（石青）
    const holoGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32, 1, true);
    const holoMaterial = new THREE.MeshBasicMaterial({
      color: 0x4e7c74,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const holoCylinder = new THREE.Mesh(holoGeometry, holoMaterial);
    holoCylinder.position.set(-10, 3.2, 0);
    group.add(holoCylinder);

    // === 顶部灯带（铜 / 石青交替）===
    for (let i = 0; i < 10; i++) {
      const lightGeometry = new THREE.BoxGeometry(2, 0.05, 0.2);
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xb5894f : 0x4e7c74,
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

    // 全息柱旋转
    const holo = group.children.find(
      (c): c is THREE.Mesh =>
        c instanceof THREE.Mesh &&
        c.geometry?.type === "CylinderGeometry" &&
        (c.material as THREE.MeshBasicMaterial)?.transparent
    );
    if (holo) {
      holo.rotation.y += delta * 0.1;
      (holo.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(timeRef.current * 2) * 0.03;
    }

    // 基座发光脉动
    const pedestalMesh = group.children.find(
      (c): c is THREE.Mesh =>
        c instanceof THREE.Mesh &&
        c.geometry?.type === "CylinderGeometry" &&
        !(c.material as THREE.MeshBasicMaterial)?.transparent
    );
    if (pedestalMesh && (pedestalMesh.material as THREE.MeshPhysicalMaterial).emissive) {
      (pedestalMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
        0.1 + Math.sin(timeRef.current * 1.5) * 0.05;
    }

    // 顶部灯带流动
    group.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.geometry?.type === "BoxGeometry" && child.position.y > 5) {
        (child.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(timeRef.current * 3 + i) * 0.4;
      }
    });
  });

  const meta = config?.meta || {};
  const portraits = [
    { title: "全栈开发工程师", desc: meta.title || "专注于构建可扩展的 Web 应用", Icon: Code2 },
    { title: "技术栈广度", desc: "React, Node.js, Go, Python, Rust…", Icon: Wrench },
    { title: "开源贡献者", desc: "热爱分享，活跃于 GitHub 社区", Icon: Star },
    { title: "持续学习者", desc: "探索 AI、WebGL、分布式系统前沿", Icon: BookOpen },
  ];

  return (
    <group ref={groupRef}>
      {/* 肖像画框 HTML 展签 */}
      {portraits.map((data, i) => {
        const x = -19 + i * 6.5;
        const Icon = data.Icon;
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
              className="w-72 h-48 bg-card/70 backdrop-blur-xl border border-border rounded-sm p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/60 transition-colors"
              onClick={onEnter}
            >
              <Icon size={30} strokeWidth={1.1} className="text-primary mb-2" aria-hidden="true" />
              <h3 className="font-display text-foreground text-lg mb-1">{data.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{data.desc}</p>
            </div>
          </Html>
        );
      })}

      {/* 个人信息全息展签 */}
      <Html transform position={[-10, 3.2, 0]} style={{ pointerEvents: "none" }} className="pointer-events-none" occlude>
        <div className="text-center w-64">
          <div className="font-plaque text-primary text-xs mb-2">档案</div>
          <h2 className="font-display text-3xl text-foreground mb-1">{meta.name || "开发者"}</h2>
          <p className="text-primary text-lg mb-4">{meta.title || "Full Stack Developer"}</p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span>{meta.location || "北京, 中国"}</span>
            <span>{meta.email || "contact@example.com"}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
