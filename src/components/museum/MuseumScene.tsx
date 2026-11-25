"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { FluidBackground } from "./effects/FluidBackground";
import { VolumetricLight } from "./effects/VolumetricLight";
import { Lobby } from "./rooms/Lobby";
import { AboutHall } from "./rooms/AboutHall";
import { ProjectsWing } from "./rooms/ProjectsWing";
import { SkillsConstellation } from "./rooms/SkillsConstellation";
import { CameraController } from "./camera/CameraController";
import { useConfig } from "@/hooks/useConfig";
import { Landmark, User, Layers, Sparkles } from "lucide-react";

type RoomId = "lobby" | "about" | "projects" | "skills";

export function MuseumScene() {
  const { config } = useConfig();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomId>("lobby");

  const handleRoomChange = (room: string) => {
    if (["lobby", "about", "projects", "skills"].includes(room)) {
      setCurrentRoom(room as RoomId);
    }
  };

  return (
    <div className="absolute inset-0 z-0" style={{ touchAction: "none" }}>
      {/* 加载指示器 */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-primary text-lg">初始化数字展厅...</p>
            <p className="text-gray-500 text-sm mt-2">正在加载着色器与资源</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        shadows={true}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          setIsLoaded(true);
        }}
        className="w-full h-full"
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent
            config={config}
            currentRoom={currentRoom}
            onRoomChange={handleRoomChange}
          />
        </Suspense>
      </Canvas>

      {/* UI 覆盖层 - 房间导航 */}
      <RoomNavigator currentRoom={currentRoom} onRoomChange={handleRoomChange} />
    </div>
  );
}

function SceneContent({
  config,
  currentRoom,
  onRoomChange,
}: {
  config: any;
  currentRoom: string;
  onRoomChange: (room: string) => void;
}) {
  return (
    <>
      {/* 全局环境光 —— 暖白聚光基调 */}
      <ambientLight intensity={0.22} color="#fff3d9" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        color="#fff3d9"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />
      {/* 青铜氧化冷补光，替代冰蓝，避免暖场过曝 */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.4}
        color="#4e7c74"
        castShadow={false}
      />

      {/* 流体背景效果 */}
      <FluidBackground />

      {/* 体积光效果 */}
      <VolumetricLight />

      {/* 房间场景 */}
      <Lobby
        config={config}
        isActive={currentRoom === "lobby"}
        onEnter={() => onRoomChange("lobby")}
      />

      <AboutHall
        config={config}
        isActive={currentRoom === "about"}
        onEnter={() => onRoomChange("about")}
      />

      <ProjectsWing
        config={config}
        isActive={currentRoom === "projects"}
        onEnter={() => onRoomChange("projects")}
      />

      <SkillsConstellation
        config={config}
        isActive={currentRoom === "skills"}
        onEnter={() => onRoomChange("skills")}
      />

      {/* 相机控制器 */}
      <CameraController currentRoom={currentRoom} />

      {/* 轨道控制器 - 允许用户自由探索 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={50}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 1.6, 0]}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html
      wrapperClass="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
      prepend
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-primary">加载展厅中...</p>
      </div>
    </Html>
  );
}

/* 房间导航 UI */
function RoomNavigator({
  currentRoom,
  onRoomChange,
}: {
  currentRoom: string;
  onRoomChange: (room: string) => void;
}) {
  const rooms = [
    { id: "lobby", label: "大厅", Icon: Landmark },
    { id: "about", label: "关于我", Icon: User },
    { id: "projects", label: "项目作品", Icon: Layers },
    { id: "skills", label: "技能星座", Icon: Sparkles },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1 rounded-sm border border-border bg-ink/70 backdrop-blur-md p-1">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomChange(room.id as any)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-sm transition-colors ${
            currentRoom === room.id
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-secondary hover:text-foreground"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <room.Icon size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{room.label}</span>
        </button>
      ))}
    </div>
  );
}