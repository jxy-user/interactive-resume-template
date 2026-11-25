"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

interface LobbyProps {
  config: any;
  isActive: boolean;
  onEnter: () => void;
}

export function Lobby({ config, isActive, onEnter }: LobbyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const pillarsRef = useRef<THREE.Mesh[]>([]);
  const chandelierRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // 初始化场景对象
  useEffect(() => {
    if (!groupRef.current) return;

    // === 大理石地板 ===
    const floorGeometry = new THREE.CircleGeometry(20, 64);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    groupRef.current.add(floor);
    floorRef.current = floor;

    // === 中心地板图案 (发光圆环) ===
    const ringGeometry = new THREE.RingGeometry(3, 3.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    groupRef.current.add(ring);

    // === 周围柱子 ===
    const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 8, 8);
    const pillarMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a4a,
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 0.3,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 15;
      const z = Math.sin(angle) * 15;

      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, 4, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      groupRef.current.add(pillar);
      pillarsRef.current.push(pillar);

      // 柱顶发光球
      const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(x, 8.2, z);
      groupRef.current.add(orb);
    }

    // === 水晶吊灯 ===
    const chandelier = new THREE.Group();
    chandelier.position.set(0, 7.5, 0);
    groupRef.current.add(chandelier);
    chandelierRef.current = chandelier;

    // 吊灯主体
    const chandelierGeometry = new THREE.TorusGeometry(1.5, 0.05, 8, 32);
    const chandelierMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0,
      clearcoat: 1,
      emissive: 0xffd700,
      emissiveIntensity: 0.5,
    });
    const chandelierRing = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
    chandelier.add(chandelierRing);

    // 悬挂水晶
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const crystalGeometry = new THREE.ConeGeometry(0.08, 0.8, 6);
      const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1,
        thickness: 0.5,
        clearcoat: 1,
        ior: 1.5,
      });
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      crystal.position.set(
        Math.cos(angle) * 1.5,
        -0.4 - Math.random() * 0.5,
        Math.sin(angle) * 1.5
      );
      crystal.rotation.x = Math.PI;
      chandelier.add(crystal);
    }

    // 中心大水晶
    const mainCrystalGeometry = new THREE.OctahedronGeometry(0.4, 1);
    const mainCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00d4ff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 1,
      clearcoat: 1,
      ior: 1.6,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.3,
    });
    const mainCrystal = new THREE.Mesh(mainCrystalGeometry, mainCrystalMaterial);
    mainCrystal.position.y = -1.5;
    chandelier.add(mainCrystal);

    // === 环境粒子 ===
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00d4ff);
    const color2 = new THREE.Color(0xff00ff);
    const color3 = new THREE.Color(0xffff00);

    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 18 + 2;
      const theta = Math.random() * Math.PI * 2;
      const y = Math.random() * 7 + 0.5;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      sizes[i] = Math.random() * 0.15 + 0.05;

      // 随机分配颜色
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.33) color = color1;
      else if (colorChoice < 0.66) color = color2;
      else color = color3;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002 + 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    groupRef.current.add(particles);
    particlesRef.current = particles;

    // === 入口动画 ===
    if (isActive) {
      animateEntrance();
    }

    // 清理函数
    return () => {
      floorGeometry.dispose();
      floorMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      pillarGeometry.dispose();
      pillarMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      pillarsRef.current.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
    };
  }, [isActive]);

  // 入口动画
  const animateEntrance = () => {
    if (!groupRef.current) return;

    groupRef.current.scale.setScalar(0.01);
    groupRef.current.position.y = -10;

    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
    });

    gsap.to(groupRef.current.position, {
      y: 0,
      duration: 1.5,
      ease: "power2.out",
    });
  };

  // 每帧动画
  useFrame((_, delta) => {
    timeRef.current += delta;

    // 吊灯旋转
    if (chandelierRef.current) {
      chandelierRef.current.rotation.y += delta * 0.1;
      chandelierRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry?.type === "OctahedronGeometry") {
          child.rotation.x += delta * 0.3;
          child.rotation.y += delta * 0.2;
          (child.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.3 + Math.sin(timeRef.current * 2) * 0.2;
        }
      });
    }

    // 粒子动画
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // 边界检查
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = 0.5;
          const r = Math.random() * 18 + 2;
          const theta = Math.random() * Math.PI * 2;
          positions[i * 3] = Math.cos(theta) * r;
          positions[i * 3 + 2] = Math.sin(theta) * r;
        }

        // 水平边界
        const dist = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);
        if (dist > 20) {
          const theta = Math.atan2(positions[i * 3 + 2], positions[i * 3]);
          positions[i * 3] = Math.cos(theta) * 18;
          positions[i * 3 + 2] = Math.sin(theta) * 18;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 中心光环脉动
    const group = groupRef.current;
    if (group) {
      const ring = group.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh && c.geometry?.type === "RingGeometry");
      if (ring) {
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(timeRef.current * 2) * 0.1;
        ring.scale.setScalar(1 + Math.sin(timeRef.current) * 0.1);
      }
    }
  });

  // 点击进入
  const handleClick = () => {
    onEnter();
  };

  return (
    <group ref={groupRef} onClick={handleClick} onPointerOver={(e) => e.stopPropagation()}>
      {/* 交互提示 - 只有激活时显示 */}
      {isActive && (
        <Html
          transform
          position={[0, 3, 0]}
          style={{ pointerEvents: "none" }}
          className="pointer-events-none"
        >
          <div className="text-center">
            <div className="animate-bounce text-primary text-2xl mb-2">▼</div>
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-primary/30">
              点击进入 · 大厅
            </div>
          </div>
        </Html>
      )}

      {/* 欢迎文本 - 总是可见但淡化 */}
      <Html
        transform
        position={[0, 4.5, 0]}
        style={{ pointerEvents: "none" }}
        className="pointer-events-none"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-fade-in">
            欢迎来到数字展厅
          </h1>
          <p className="text-lg text-white/60 mt-2 max-w-md mx-auto">
            探索我的技能、项目与故事。使用底部导航或点击展厅入口自由漫游。
          </p>
        </div>
      </Html>
    </group>
  );
}