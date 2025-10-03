import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CanvasBackground({ bg }) {
  const { scene } = useThree();

  useEffect(() => {
    if (bg === "black") scene.background = new THREE.Color("#000000");
    else if (bg === "white") scene.background = new THREE.Color("#ffffff");
    // You can add more colors or HDRI textures here
  }, [bg, scene]);

  return null; // no UI, only updates scene
}
