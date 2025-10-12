// components/Cabinet.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { buildCabinet } from "../generators/cabinetGenerator";

export default function Cabinet({ params, textures, visibility, position = [0, 0, 0] }) {
  const groupRef = useRef();

  // Build once on mount or params/textures/visibility change
  useEffect(() => {
    const group = buildCabinet(params, textures, visibility);
    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(group);
    }

    return () => {
      group.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        }
      });
    };
  }, [params, textures, visibility]);

  // Optional rotation/animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0; // or any small animation
    }
  });

  return <group ref={groupRef} position={position} />;
}
