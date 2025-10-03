import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Cabinet({
  position = [0, 0.5, 0],
  width = 100,
  height = 150,
  depth = 60,
  numDrawers = 3,
  textures = {}, // { frame, drawer, handle, leg }
  visibility = {}, // { frame, drawer, handle, leg }
}) {
  const group = useRef();

  useFrame(() => {
    if (group.current) {
      // Scale cabinet according to width/height/depth
      group.current.scale.set(width / 100, height / 100, depth / 100);
    }
  });

  const drawerHeightUnit = 1 / numDrawers; // height per drawer in unit cube

  return (
    <group ref={group} position={position}>
      {/* Frame */}
      {visibility.frame && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={textures.frame?.color || "#8B4513"}
            map={textures.frame?.map || null}
          />
        </mesh>
      )}

      {/* Drawers */}
      {visibility.drawer &&
        Array.from({ length: numDrawers }).map((_, i) => {
          const yPos = -0.5 + drawerHeightUnit / 2 + i * drawerHeightUnit; // align in frame
          return (
            <mesh key={i} position={[0, yPos, 0.51]}>
              <boxGeometry args={[0.9, drawerHeightUnit * 0.9, 0.1]} />
              <meshStandardMaterial
                color={textures.drawer?.color || "#555"}
                map={textures.drawer?.map || null}
              />
            </mesh>
          );
        })}

      {/* Handles */}
      {visibility.handle &&
        Array.from({ length: numDrawers }).map((_, i) => {
          const yPos = -0.5 + drawerHeightUnit / 2 + i * drawerHeightUnit; // same as drawer
          return (
            <mesh key={i} position={[0, yPos, 0.51 + 0.06]}>
              {/* slightly in front of drawer */}
              <boxGeometry args={[0.2, 0.05, 0.02]} />
              <meshStandardMaterial
                color={textures.handle?.color || "#222"}
                map={textures.handle?.map || null}
              />
            </mesh>
          );
        })}

      {/* Legs */}
      {visibility.leg &&
        [
          [-0.45, -0.55, -0.45],
          [-0.45, -0.55, 0.45],
          [0.45, -0.55, -0.45],
          [0.45, -0.55, 0.45],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial
              color={textures.leg?.color || "#333"}
              map={textures.leg?.map || null}
            />
          </mesh>
        ))}
    </group>
  );
}
