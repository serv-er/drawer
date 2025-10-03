import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton } from "@react-three/xr";
import { Environment } from "@react-three/drei";
import Cabinet from "./components/Cabinet";
import CameraControls from "./components/CameraControls";
import PartControls from "./components/PartControls";
import TextureControls from "./components/TextureControls";
import DimensionControls from "./components/DimensionControls";
import BackgroundSelectorUI from "./components/BackgroundSelectorUI";

export default function ARApp({
  width, height, depth, numDrawers, modelPos,
  visibility, textures, bg,
  setWidth, setHeight, setDepth, setModelPos, setNumDrawers,
  setVisibility, setTextures, setBg,
  onExit
}) {
  return (
    <div className="w-screen h-screen relative">
      {/* 🔘 AR Session Button */}
      <ARButton />

      <Canvas camera={{ position: [3, 3, 6], fov: 50 }}>
        <XR>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          {bg === "hdri" && <Environment preset="sunset" />}

          <Suspense fallback={null}>
            <Cabinet
              position={[modelPos.x, modelPos.y, modelPos.z]}
              width={width}
              height={height}
              depth={depth}
              numDrawers={numDrawers}
              textures={textures}
              visibility={visibility}
            />
            <CameraControls target={[modelPos.x, modelPos.y, modelPos.z]} />
          </Suspense>
        </XR>
      </Canvas>

      {/* Exit AR */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition"
      >
        Exit AR
      </button>

      {/* Control Panel (reused UI) */}
      <div className="fixed bottom-0 w-full bg-white p-4 space-y-4 overflow-y-auto max-h-[40vh]">
        <DimensionControls
          width={width} height={height} depth={depth}
          setWidth={setWidth} setHeight={setHeight} setDepth={setDepth}
          modelPos={modelPos} setModelPos={setModelPos}
          numDrawers={numDrawers} setNumDrawers={setNumDrawers}
        />
        <PartControls visibility={visibility} setVisibility={setVisibility} />
        <TextureControls textures={textures} setTextures={setTextures} />
        <BackgroundSelectorUI bg={bg} setBg={setBg} />
      </div>
    </div>
  );
}
