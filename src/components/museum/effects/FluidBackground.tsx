"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 流体背景着色器 - 基于 Pavel Dobryakov 的 WebGL Fluid Simulation
 * 简化版：使用着色器模拟流体动力学，作为背景氛围
 */
export function FluidBackground() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);
  const resolutionRef = useRef(new THREE.Vector2());

  // 顶点着色器 - 全屏四边形
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // 片元着色器 - 流体模拟 + 颜色映射
  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec2 vUv;

    // 伪随机数
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 2D 噪声
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      f = f * f * (3.0 - 2.0 * f);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // 分形布朗运动 (fBm)
    float fbm(vec2 st, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    // 涡流噪声 - 模拟流体旋转
    float vortexNoise(vec2 st, float time) {
      vec2 q = vec2(
        fbm(st + vec2(time * 0.1, time * 0.05), 4),
        fbm(st + vec2(time * 0.07, time * 0.12), 4)
      );
      vec2 r = vec2(
        fbm(st + q * 2.0 + vec2(time * 0.03, time * 0.08), 4),
        fbm(st + q * 2.0 + vec2(time * 0.11, time * 0.04), 4)
      );
      return fbm(st + r * 3.0, 4);
    }

    void main() {
      vec2 uv = vUv;

      // 纵横比修正
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      uv *= aspect;

      // 多层流体动画
      float t = uTime * 0.15;

      // 主流体场
      float fluid1 = vortexNoise(uv * 2.0 + vec2(t * 0.3, t * 0.2), t);
      float fluid2 = vortexNoise(uv * 3.0 - vec2(t * 0.25, t * 0.35), t + 100.0);
      float fluid3 = vortexNoise(uv * 1.5 + vec2(t * 0.15, t * 0.4), t + 200.0);

      // 组合流体场
      float fluid = fluid1 * 0.5 + fluid2 * 0.3 + fluid3 * 0.2;

      // 添加径向渐变遮罩
      float dist = length(uv - 0.5) * 1.5;
      float vignette = smoothstep(1.0, 0.3, dist);
      fluid *= vignette;

      // 颜色映射 - 使用三色渐变
      vec3 color = mix(uColorA, uColorB, fluid);
      color = mix(color, uColorC, fluid * fluid);

      // 添加高光
      float highlight = pow(fluid, 8.0) * 0.5;
      color += vec3(highlight);

      // 伽马校正
      color = pow(color, vec3(0.9));

      // 透明度 - 边缘淡出
      float alpha = fluid * vignette * 0.4;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: resolutionRef.current },
    uColorA: { value: new THREE.Color(0x0c0a08) },  // 暖墨
    uColorB: { value: new THREE.Color(0x1c1813) },  // 暖褐
    uColorC: { value: new THREE.Color(0x3a2c1a) },  // 暗铜
  }), []);

  // 更新 uniform
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uResolution.value.set(
        state.gl.domElement.width,
        state.gl.domElement.height
      );
    }
  });

  // 响应窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      resolutionRef.current.set(window.innerWidth, window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <mesh
      geometry={new THREE.PlaneGeometry(2, 2)}
      material={
        new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          transparent: true,
          depthWrite: false,
          side: THREE.BackSide, // 渲染背面，作为天空盒
        })
      }
      ref={(mesh) => {
        if (mesh) materialRef.current = mesh.material as THREE.ShaderMaterial;
      }}
      position={[0, 0, -50]}
      scale={[100, 100, 100]}
    />
  );
}