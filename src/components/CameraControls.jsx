import React, { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";

export default function CameraControls({ target }) {
  const controls = useRef();
  useEffect(() => {
    if (controls.current)
      controls.current.target.set(target[0], target[1], target[2]);
  }, [target]);
  return <OrbitControls ref={controls} maxPolarAngle={Math.PI / 2} />;
}
