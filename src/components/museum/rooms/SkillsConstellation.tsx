"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

interface SkillsConstellationProps {
  config: any;
  isActive: boolean;
  onEnter: () => void;
}

interface SkillStar {
  name: string;
  category: string;
  position: THREE.Vector3;
  size: number;
  brightness: number;
  color: THREE.Color;
}

interface SkillConstellation {
  category: string;
  center: THREE.Vector3;
  stars: SkillStar[];
}

export function SkillsConstellation({ config, isActive, onEnter }: SkillsConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const starRefs = useRef<THREE.Mesh[]>([]);
  const lineRefs = useRef<THREE.Line[]>([]);
  const connectionLinesRef = useRef<THREE.Line[]>([]);
  const timeRef = useRef(0);

  // 技能数据 - 分类为星座
  const skillConstellations = useMemo<SkillConstellation[]>(() => {
    const about = config?.about || {};
    const skills = about?.skills || [
      { category: "前端", items: ["React", "Vue", "TypeScript", "Next.js", "Tailwind", "Three.js", "Framer Motion"] },
      { category: "后端", items: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "GraphQL", "gRPC"] },
      { category: "基础设施", items: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Prometheus", "Grafana"] },
      { category: "工程文化", items: ["TDD", "Code Review", "架构设计", "性能优化", "开源贡献", "技术写作", "团队指导"] },
    ];

    // 为每个类别生成星座位置
    return skills.map((cat: { category: string; items: string[] }, catIndex: number) => {
      const centerAngle = (catIndex / skills.length) * Math.PI * 2;
      const centerRadius = 8;
      const centerX = Math.cos(centerAngle) * centerRadius;
      const centerZ = Math.sin(centerAngle) * centerRadius;
      const centerY = 3 + catIndex * 1.5;

      const stars = cat.items.map((item: string, itemIndex: number) => {
        const angle = (itemIndex / cat.items.length) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 1;
        return {
          name: item,
          category: cat.category,
          position: new THREE.Vector3(
            centerX + Math.cos(angle) * radius,
            centerY + (Math.random() - 0.5) * 1,
            centerZ + Math.sin(angle) * radius
          ),
          size: 0.15 + Math.random() * 0.15,
          brightness: 0.5 + Math.random() * 0.5,
          color: new THREE.Color().setHSL((catIndex * 0.3 + itemIndex * 0.1) % 1, 0.7, 0.5),
        };
      });

      return { category: cat.category, center: new THREE.Vector3(centerX, centerY, centerZ), stars };
    });
  }, [config]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // === 宇宙背景 - 星空 ===
    const bgGeometry = new THREE.SphereGeometry(100, 32, 32);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
    group.add(bgSphere);

    // 远处恒星
    const farStarsGeometry = new THREE.BufferGeometry();
    const farStarCount = 2000;
    const farPositions = new Float32Array(farStarCount * 3);
    const farColors = new Float32Array(farStarCount * 3);
    const farSizes = new Float32Array(farStarCount);

    for (let i = 0; i < farStarCount; i++) {
      const radius = 80 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      farPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      farPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      farPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5 + Math.random() * 0.5);
      farColors[i * 3] = color.r;
      farColors[i * 3 + 1] = color.g;
      farColors[i * 3 + 2] = color.b;

      farSizes[i] = Math.random() * 0.5 + 0.1;
    }

    farStarsGeometry.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
    farStarsGeometry.setAttribute("color", new THREE.BufferAttribute(farColors, 3));
    farStarsGeometry.setAttribute("size", new THREE.BufferAttribute(farSizes, 1));

    const farStarsMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const farStars = new THREE.Points(farStarsGeometry, farStarsMaterial);
    group.add(farStars);

    // === 创建技能星座 ===
    const starGeometry = new THREE.SphereGeometry(1, 16, 16);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    skillConstellations.forEach((constellation, catIndex) => {
      // 分类中心标记
      const centerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const centerMaterial = new THREE.MeshBasicMaterial({
        color: constellation.stars[0]?.color || 0x00d4ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const centerMarker = new THREE.Mesh(centerGeometry, centerMaterial);
      centerMarker.position.copy(constellation.center);
      group.add(centerMarker);

      // 创建星星
      constellation.stars.forEach((star, starIndex) => {
        const starMaterial = new THREE.MeshBasicMaterial({
          color: star.color,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });

        const starMesh = new THREE.Mesh(starGeometry.clone(), starMaterial);
        starMesh.scale.setScalar(star.size);
        starMesh.position.copy(star.position);
        starMesh.userData = { ...star, constellationIndex: catIndex, starIndex };
        group.add(starMesh);
        starRefs.current.push(starMesh);

        // 连接线 - 到中心
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array([
          constellation.center.x, constellation.center.y, constellation.center.z,
          star.position.x, star.position.y, star.position.z,
        ]);
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const line = new THREE.Line(lineGeometry, lineMaterial.clone());
        line.userData = { from: constellation.center.clone(), to: star.position.clone(), constellationIndex: catIndex, starIndex };
        group.add(line);
        lineRefs.current.push(line);
      });

      // 星座内部连接线 (形成图案)
      for (let i = 0; i < constellation.stars.length; i++) {
        for (let j = i + 1; j < constellation.stars.length; j++) {
          // 只连接距离较近的星星
          const dist = constellation.stars[i].position.distanceTo(constellation.stars[j].position);
          if (dist < 3) {
            const connGeometry = new THREE.BufferGeometry();
            const connPositions = new Float32Array([
              constellation.stars[i].position.x, constellation.stars[i].position.y, constellation.stars[i].position.z,
              constellation.stars[j].position.x, constellation.stars[j].position.y, constellation.stars[j].position.z,
            ]);
            connGeometry.setAttribute("position", new THREE.BufferAttribute(connPositions, 3));
            const connMaterial = new THREE.LineBasicMaterial({
              color: constellation.stars[i].color,
              transparent: true,
              opacity: 0.2,
              blending: THREE.AdditiveBlending,
            });
            const connLine = new THREE.Line(connGeometry, connMaterial);
            group.add(connLine);
            connectionLinesRef.current.push(connLine);
          }
        }
      }
    });

    // === 中心引力球 ===
    const coreGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1a,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      thickness: 2,
      clearcoat: 1,
      clearcoatRoughness: 0,
      ior: 1.5,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.2,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.set(0, 3, 0);
    group.add(core);

    // 核心光环
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(2 + i * 0.5, 2.2 + i * 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.1 / (i + 1),
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 3;
      group.add(ring);
    }

    // 入口动画
    if (isActive) {
      group.scale.setScalar(0.01);
      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
      });
    }

    // 清理
    return () => {
      bgGeometry.dispose();
      bgMaterial.dispose();
      farStarsGeometry.dispose();
      farStarsMaterial.dispose();
      starGeometry.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      starRefs.current.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      lineRefs.current.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      connectionLinesRef.current.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    };
  }, [isActive, config, skillConstellations, onEnter]);

  // HTML 标签在渲染时返回
  const categoryLabels = skillConstellations.map((constellation) => (
    <Html
      key={`category-${constellation.category}`}
      transform
      position={constellation.center.clone().add(new THREE.Vector3(0, 2, 0)).toArray()}
      style={{ pointerEvents: "none" }}
      className="pointer-events-none"
      occlude
    >
      <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium border border-white/10 whitespace-nowrap">
        {constellation.category}
      </div>
    </Html>
  ));

  const starLabels = skillConstellations.flatMap((constellation, catIndex) =>
    constellation.stars.map((star, starIndex) => (
      <Html
        key={`star-${catIndex}-${starIndex}`}
        transform
        position={star.position.clone().add(new THREE.Vector3(0, 0.5, 0)).toArray()}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
        className="pointer-events-auto"
        occlude
      >
        <div
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm font-medium min-w-[120px] text-center group hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
          onClick={onEnter}
        >
          {star.name}
        </div>
      </Html>
    ))
  );

  // 射线检测 - 悬停高亮
  useFrame((state) => {
    timeRef.current += state.clock.getDelta();

    const group = groupRef.current;
    if (!group) return;

    // 核心呼吸动画
    const core = group.children.find(
      (c): c is THREE.Mesh => c instanceof THREE.Mesh && c.geometry?.type === "SphereGeometry" && !!(c.material as THREE.MeshPhysicalMaterial)?.transmission
    );
    if (core) {
      core.rotation.y += state.clock.getDelta() * 0.1;
      (core.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.15 + Math.sin(timeRef.current * 1.5) * 0.1;
      core.scale.setScalar(1 + Math.sin(timeRef.current * 0.8) * 0.05);
    }

    // 光环旋转
    group.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry?.type === "RingGeometry") {
        child.rotation.z += state.clock.getDelta() * (0.1 + Math.random() * 0.05);
        (child.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(timeRef.current * 2 + Math.random() * 10) * 0.03;
      }
    });

    // 星星动画
    starRefs.current.forEach((star, i) => {
      const userData = star.userData as { size?: number; constellationIndex?: number; starIndex?: number } | undefined;
      const baseScale = userData?.size || 0.2;

      // 脉动
      star.scale.setScalar(baseScale * (1 + Math.sin(timeRef.current * 2 + i) * 0.3));

      // 绕中心缓慢公转
      if (userData?.constellationIndex !== undefined) {
        const constellation = skillConstellations[userData.constellationIndex];
        if (constellation) {
          const angle = timeRef.current * 0.1 + (userData.starIndex || 0);
          const radius = star.position.clone().sub(constellation.center).length();
          star.position.x = constellation.center.x + Math.cos(angle) * radius;
          star.position.z = constellation.center.z + Math.sin(angle) * radius;
        }
      }
    });

    // 连接线跟随星星更新
    lineRefs.current.forEach((line) => {
      const userData = line.userData as { constellationIndex?: number; starIndex?: number } | undefined;
      if (userData && userData.constellationIndex !== undefined && userData.starIndex !== undefined) {
        const positions = line.geometry.attributes.position.array as Float32Array;
        // 找到对应的星星
        const star = starRefs.current.find((s) => {
          const sd = s.userData as { starIndex?: number; constellationIndex?: number } | undefined;
          return sd?.starIndex === userData.starIndex && sd?.constellationIndex === userData.constellationIndex;
        });
        if (star) {
          positions[3] = star.position.x;
          positions[4] = star.position.y;
          positions[5] = star.position.z;
          line.geometry.attributes.position.needsUpdate = true;
        }
      }
    });

    // 远处星星缓慢旋转
    const farStars = group.children.find((c): c is THREE.Points => c instanceof THREE.Points && c.geometry?.attributes?.position?.count && c.geometry.attributes.position.count > 1000);
    if (farStars) {
      farStars.rotation.y += state.clock.getDelta() * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {categoryLabels}
      {starLabels}
    </group>
  );
}