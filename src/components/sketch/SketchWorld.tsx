"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Corridor, type RoomKey } from "./Corridor";
import {
  GalleryRoom,
  StudioRoom,
  AboutRoom,
  EducationRoom,
  ExperienceRoom,
  ContactRoom,
} from "./Rooms";
import { AudioToggle } from "./AudioToggle";

const ROOMS = ["gallery", "studio", "about", "education", "experience", "contact"] as const;

export function SketchWorld() {
  const [room, setRoom] = useState<RoomKey>("corridor");
  const back = () => setRoom("corridor");

  // 深链：?room=gallery 直达某个房间
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("room");
    if (r && (ROOMS as readonly string[]).includes(r)) setRoom(r as RoomKey);
  }, []);

  return (
    <div className="relative bg-background">
      <AudioToggle />
      <AnimatePresence mode="wait">
        {room === "corridor" && <Corridor key="corridor" onEnter={setRoom} />}
        {room === "gallery" && <GalleryRoom key="gallery" onBack={back} />}
        {room === "studio" && <StudioRoom key="studio" onBack={back} />}
        {room === "about" && <AboutRoom key="about" onBack={back} />}
        {room === "education" && <EducationRoom key="education" onBack={back} />}
        {room === "experience" && <ExperienceRoom key="experience" onBack={back} />}
        {room === "contact" && <ContactRoom key="contact" onBack={back} />}
      </AnimatePresence>
    </div>
  );
}
