"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

interface ProjectsWingProps {
  config: any;
  isActive: boolean;
  onEnter: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  technologies: string[];
  github: string;
}

export function ProjectsWing({ config, isActive, onEnter }: ProjectsWingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const projectCubesRef = useRef<THREE.Group[]>([]);
  const timeRef = useRef(0);

  const projects = config?.projects || [];

  // 如果没有项目数据，使用演示数据
  const demoProjects = useMemo<ProjectData[]>(() => (projects.length > 0 ? projects : [
    { name: "交互式简历模板", description: "Next.js + Three.js 沉浸式作品集", technologies: ["React", "Three.js", "Tailwind"], github: "#" },
    { name: "实时协作编辑器", description: "基于 CRDT 的多人协作文档", technologies: ["TypeScript", "Yjs", "WebRTC"], github: "#" },
    { name: "AI 代码审查助手", description: "自动化代码质量分析工具", technologies: ["Python", "LLM", "AST"], github: "#" },
    { name: "微服务监控平台", description: "分布式链路追踪与指标可视化", technologies: ["Go", "Prometheus", "Grafana"], github: "#" },
    { name: "WebGL 粒子引擎", description: "高性能 GPU 粒子系统", technologies: ["WebGL", "GLSL", "WASM"], github: "#" },
    { name: "开发者 CLI 工具", description: "项目脚手架与自动化工作流", technologies: ["Node.js", "Commander", "Inquirer"], github: "#" },
  ]), [projects]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // === 展厅结构：开放式画廊 ===
    // 地板 - 反射材质
    const floorGeometry = new THREE.PlaneGeometry(40, 30);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0c0a08,
      metalness: 0.8,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(15, 0, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // 背景墙 - 深度感
    const backWallGeometry = new THREE.PlaneGeometry(40, 15);
    const backWallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x14110c,
      metalness: 0.1,
      roughness: 0.5,
    });
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.set(15, 7.5, -15);
    backWall.rotation.y = Math.PI;
    group.add(backWall);

    // === 项目展示立方体 ===
    const cubeSize = 3;
    const gap = 1;
    const cols = 3;
    const rows = Math.ceil(demoProjects.length / cols);

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    demoProjects.forEach((project, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = 5 + col * (cubeSize + gap) - (cols - 1) * (cubeSize + gap) / 2;
      const z = -2 - row * (cubeSize + gap);
      const y = cubeSize / 2 + 0.5;

      // 展品色板 —— 铜 / 石青 / 暖白 / 深铜
      const palette = [0xb5894f, 0x4e7c74, 0xfff3d9, 0x8a6a3b];
      const color = new THREE.Color(palette[i % palette.length]);

      // 创建多层材质效果
      const cubeGroup = new THREE.Group();
      cubeGroup.position.set(15 + x, y, z);

      // 外层发光框架
      const frameGeometry = new THREE.BoxGeometry(cubeSize + 0.1, cubeSize + 0.1, cubeSize + 0.1);
      const frameMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      cubeGroup.add(frame);

      // 主立方体 - 玻璃材质
      const cubeMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        ior: 1.5,
        emissive: color,
        emissiveIntensity: 0.1,
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cubeGroup.add(cube);

      // 内部核心 - 发光球体
      const coreGeometry = new THREE.SphereGeometry(cubeSize * 0.3, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      cubeGroup.add(core);

      // 环绕粒子环
      const ringGeometry = new THREE.TorusGeometry(cubeSize * 0.6, 0.02, 8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
      ring1.rotation.x = Math.PI / 2;
      cubeGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
      ring2.rotation.y = Math.PI / 2;
      cubeGroup.add(ring2);

      group.add(cubeGroup);
      projectCubesRef.current.push(cubeGroup);
    });

    // === 顶部聚光灯阵列 ===
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = 5 + col * (cubeSize + gap) - (cols - 1) * (cubeSize + gap) / 2;
        const z = -2 - row * (cubeSize + gap);

        const spotlight = new THREE.SpotLight(0xffffff, 50);
        spotlight.position.set(15 + x, 12, z);
        spotlight.target.position.set(15 + x, 0, z);
        spotlight.angle = Math.PI / 6;
        spotlight.penumbra = 0.5;
        spotlight.decay = 1.5;
        spotlight.distance = 20;
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.set(512, 512);
        group.add(spotlight);
        group.add(spotlight.target);
      }
    }

    // 入口动画
    if (isActive) {
      group.position.z = 30;
      gsap.to(group.position, {
        z: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    // 清理
    return () => {
      floorGeometry.dispose();
      floorMaterial.dispose();
      backWallGeometry.dispose();
      backWallMaterial.dispose();
      cubeGeometry.dispose();
      projectCubesRef.current.forEach((cubeGroup) => {
        cubeGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
      });
    };
  }, [isActive, config, onEnter, demoProjects]);

  // 动画循环
  useFrame((_, delta) => {
    timeRef.current += delta;

    projectCubesRef.current.forEach((cubeGroup, i) => {
      // 整体缓慢旋转
      cubeGroup.rotation.y += delta * 0.05;

      // 内部核心脉动
      const core = cubeGroup.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh && c.geometry?.type === "SphereGeometry");
      if (core) {
        core.scale.setScalar(1 + Math.sin(timeRef.current * 2 + i) * 0.15);
        (core.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(timeRef.current * 3 + i) * 0.2;
      }

      // 线框旋转
      const frame = cubeGroup.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh && (c.material as THREE.MeshBasicMaterial)?.wireframe);
      if (frame) {
        frame.rotation.x += delta * 0.02;
        frame.rotation.z += delta * 0.03;
      }

      // 环旋转
      cubeGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry?.type === "TorusGeometry") {
          child.rotation.x += delta * 0.1;
          child.rotation.y += delta * 0.05;
        }
      });

      // 浮动动画
      cubeGroup.position.y = cubeGroup.position.y + Math.sin(timeRef.current + i) * 0.002;
    });
  });

  return (
    <group ref={groupRef}>
      {demoProjects.map((project, i) => {
        const cols = 3;
        const cubeSize = 3;
        const gap = 1;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 5 + col * (cubeSize + gap) - (cols - 1) * (cubeSize + gap) / 2;
        const z = -2 - row * (cubeSize + gap);
        const y = cubeSize / 2 + 0.5;

        return (
          <Html
            key={`project-label-${i}`}
            transform
            position={[15 + x, y + cubeSize / 2 + 0.8, z]}
            style={{ pointerEvents: "auto" }}
            className="pointer-events-auto"
            occlude
          >
            <div
              className="w-56 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-3 text-center group hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={onEnter}
            >
              <h4 className="font-bold text-white text-sm mb-1 truncate">{project.name}</h4>
              <p className="text-white/50 text-xs mb-2 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 justify-center mb-2">
                {project.technologies?.slice(0, 4).map((tech: string, ti: number) => (
                  <span key={ti} className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded border border-primary/30">
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                代码
              </a>
            </div>
          </Html>
        );
      })}
    </group>
  );
}