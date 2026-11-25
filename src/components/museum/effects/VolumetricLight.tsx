"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 体积光效果 - God Rays / Light Shafts
 * 使用后处理或几何体模拟体积光
 */
export function VolumetricLight() {
  const lightMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!lightMeshRef.current) return;

    // 创建体积光锥几何体
    const geometry = new THREE.ConeGeometry(5, 30, 32, 1, true);
    geometry.translate(0, 15, 0);
    geometry.rotateX(-Math.PI / 2);

    // 体积光材质 - 使用深度测试和混合模式
    const material = new THREE.MeshBasicMaterial({
      color: 0xfff8e7,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // 创建多层锥体叠加增强效果
    const layers = [1, 2, 3].map((i) => {
      const mesh = new THREE.Mesh(geometry.clone(), material.clone());
      mesh.scale.setScalar(0.7 + i * 0.15);
      mesh.material.opacity = 0.015 / i;
      lightMeshRef.current!.add(mesh);
      return mesh;
    });

    // 粒子系统 - 光束中的尘埃粒子
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // 在锥体内随机分布
      const h = Math.random() * 30;
      const r = (h / 30) * 5 * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;

      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = r * Math.sin(theta);

      sizes[i] = Math.random() * 2 + 0.5;
      alphas[i] = Math.random() * 0.5 + 0.1;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    particleGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfff8e7,
      size: 1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.set(0, 0, 0);
    lightMeshRef.current.add(particles);
    particlesRef.current = particles;

    return () => {
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      layers.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    };
  }, []);

  // 动画更新
  useFrame((_, delta) => {
    timeRef.current += delta;

    // 体积光锥体呼吸动画
    if (lightMeshRef.current) {
      lightMeshRef.current.rotation.y += delta * 0.02;
      const scale = 1 + Math.sin(timeRef.current * 0.5) * 0.05;
      lightMeshRef.current.scale.setScalar(scale);
    }

    // 粒子动画
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
      const alphas = particlesRef.current.geometry.attributes.alpha.array as Float32Array;
      const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        // 更新位置
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // 粒子上升并淡出
        if (positions[i * 3 + 1] > 30) {
          positions[i * 3] = (Math.random() - 0.5) * 2;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
          alphas[i] = Math.random() * 0.5 + 0.1;
        }

        // 基于高度的透明度
        const h = positions[i * 3 + 1];
        alphas[i] *= 0.999;
        if (alphas[i] < 0.01) alphas[i] = Math.random() * 0.5 + 0.1;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.alpha.needsUpdate = true;
    }
  });

  return (
    <group ref={lightMeshRef} position={[0, 0, 0]}>
      {/* 主光源位置标记 */}
      <pointLight
        position={[0, 30, 0]}
        color="#fff8e7"
        intensity={2}
        distance={60}
        decay={1.5}
      />
    </group>
  );
}

/**
 * 替代方案：使用后处理的体积光 (需要 @react-three/postprocessing)
 * 如果需要更真实的 God Rays，可以取消注释下面的组件并使用 EffectComposer
 */

// import { EffectComposer, RenderPass, GodRaysPass } from '@react-three/postprocessing';

// export function VolumetricLightPostProcessing() {
//   return (
//     <EffectComposer multisampling={0} renderPriority={1}>
//       <RenderPass />
//       <GodRaysPass
//         density={0.95}
//         weight={0.55}
//         decay={0.96}
//         exposure={0.3}
//         samples={60}
//         clampMax={1.0}
//         resolutionScale={0.5}
//       />
//     </EffectComposer>
//   );
// }