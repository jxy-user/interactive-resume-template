"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

/**
 * 相机控制器 - 负责房间间的平滑飞行过渡
 */
interface RoomCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

// 房间相机配置
const ROOM_CAMERAS: Record<string, RoomCameraConfig> = {
  lobby: {
    position: [0, 1.6, 8],
    target: [0, 1.6, 0],
    fov: 60,
  },
  about: {
    position: [-12, 2.5, 3],
    target: [-10, 1.8, 0],
    fov: 55,
  },
  projects: {
    position: [12, 3, 2],
    target: [10, 2, 0],
    fov: 50,
  },
  skills: {
    position: [0, 15, 10],
    target: [0, 5, 0],
    fov: 45,
  },
};

export function CameraController({ currentRoom }: { currentRoom: string }) {
  const { camera } = useThree();
  const isTransitioning = useRef(false);
  const transitionStartRef = useRef<{ position: THREE.Vector3; target: THREE.Vector3; fov: number } | null>(null);

  // 监听房间变化，触发相机过渡
  useEffect(() => {
    const targetConfig = ROOM_CAMERAS[currentRoom];
    if (!targetConfig) return;

    // 确保是 PerspectiveCamera
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    isTransitioning.current = true;
    transitionStartRef.current = {
      position: camera.position.clone(),
      target: new THREE.Vector3().copy(camera.position).add(new THREE.Vector3(0, 0, -1)),
      fov: camera.fov,
    };

    const targetPosition = new THREE.Vector3(...targetConfig.position);
    const targetTarget = new THREE.Vector3(...targetConfig.target);
    const targetFov = targetConfig.fov || 60;

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2.0,
      ease: "power2.inOut",
      onComplete: () => {
        isTransitioning.current = false;
        transitionStartRef.current = null;
      },
    });

    // 目标点插值
    gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: function () {
          const progress = this.progress();
          if (transitionStartRef.current) {
            const start = transitionStartRef.current;
            const currentTarget = new THREE.Vector3().lerpVectors(start.target, targetTarget, progress);
            camera.lookAt(currentTarget);
          }
        },
      }
    );

    // FOV 插值
    gsap.to(camera, {
      fov: targetFov,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [currentRoom, camera]);

  // 每帧确保相机看向正确目标（过渡期间）
  useFrame(() => {
    if (isTransitioning.current && transitionStartRef.current) {
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/**
 * 手动相机控制 - 允许用户在房间内自由探索
 * 与 OrbitControls 配合使用
 */
export function useCameraControls() {
  const { camera } = useThree();
  const isUserInteracting = useRef(false);

  // 可以在这里添加键盘/手势控制
  // 例如：WASD 移动、鼠标视角控制等

  return {
    enableUserControl: () => { isUserInteracting.current = true; },
    disableUserControl: () => { isUserInteracting.current = false; },
    isUserInteracting: () => isUserInteracting.current,
  };
}

/**
 * 导览路径 - 预设的自动游览路径
 */
export const TOUR_PATH = [
  { room: "lobby", duration: 5000, pause: 2000 },
  { room: "about", duration: 8000, pause: 3000 },
  { room: "projects", duration: 10000, pause: 3000 },
  { room: "skills", duration: 8000, pause: 2000 },
  { room: "lobby", duration: 5000, pause: 0 },
];

/**
 * 自动导览控制器
 */
export function useAutoTour(onRoomChange: (room: string) => void) {
  const tourIndexRef = useRef(0);
  const isTouringRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTour = () => {
    isTouringRef.current = true;
    tourIndexRef.current = 0;
    nextStop();
  };

  const stopTour = () => {
    isTouringRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextStop = () => {
    if (!isTouringRef.current) return;

    const stop = TOUR_PATH[tourIndexRef.current];
    if (!stop) {
      stopTour();
      return;
    }

    onRoomChange(stop.room);

    timeoutRef.current = setTimeout(() => {
      tourIndexRef.current++;
      nextStop();
    }, stop.duration + stop.pause);
  };

  return { startTour, stopTour, isTouring: isTouringRef.current };
}