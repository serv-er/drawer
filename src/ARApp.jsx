// ARApp.jsx
import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton } from "@react-three/xr";
import { Environment } from "@react-three/drei";
import Cabinet from "./components/Cabinet";
import CameraControls from "./components/CameraControls";
import PartControls from "./components/PartControls";
import TextureControls from "./components/TextureControls";
import DimensionControls from "./components/DimensionControls";
import BackgroundSelectorUI from "./components/BackgroundSelectorUI";
import toast from "react-hot-toast";
import { buildCabinet } from "./generators/cabinetGenerator";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Convert UI slider values (cm) to meters
const uiToMeters = (uiVal) => uiVal / 100;

export default function ARApp({
  width,
  height,
  depth,
  numDrawers,
  modelPos,
  visibility,
  textures,
  bg,
  setWidth,
  setHeight,
  setDepth,
  setModelPos,
  setNumDrawers,
  setVisibility,
  setTextures,
  setBg,
  onExit,
}) {
  const params = useMemo(
    () => ({
      width: uiToMeters(width),
      height: uiToMeters(height),
      depth: uiToMeters(depth),
      numDrawers,
    }),
    [width, height, depth, numDrawers]
  );

  const texturesMap = useMemo(
    () => ({
      frame: textures.frame?.map || null,
      drawer: textures.drawer?.map || null,
      handle: textures.handle?.map || null,
      leg: textures.leg?.map || null,
    }),
    [textures]
  );

  // Fallback AR: Export cabinet as GLB and open Scene Viewer
  const handleFallbackAR = async () => {
    try {
      const group = buildCabinet(params, texturesMap, visibility);
      const exporter = new GLTFExporter();

      exporter.parse(
        group,
        (result) => {
          const blob = result instanceof ArrayBuffer
            ? new Blob([result], { type: "model/gltf-binary" })
            : new Blob([JSON.stringify(result)], { type: "application/json" });

          const url = URL.createObjectURL(blob);

          // Open Scene Viewer (Android/iOS)
          const intentURL = `intent://arvr.google.com/scene-viewer/1.0?file=${url}&mode=ar_preferred#Intent;package=com.google.android.googlequicksearchbox;scheme=https;end;`;
          window.location.href = intentURL;
        },
        { binary: true }
      );
    } catch (err) {
      console.error(err);
      toast.error("Fallback AR failed. Check console.");
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* AR Session Button */}
      {navigator.xr ? (
        <ARButton className="absolute top-4 left-4 z-50" />
      ) : (
        <button
          onClick={handleFallbackAR}
          className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Open in AR (Fallback)
        </button>
      )}

      <Canvas camera={{ position: [3, 3, 6], fov: 50 }}>
        <XR>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          {bg === "hdri" && <Environment preset="sunset" />}
          <Suspense fallback={null}>
            <Cabinet
              position={[modelPos.x, modelPos.y, modelPos.z]}
              params={params}
              textures={texturesMap}
              visibility={visibility}
            />
            <CameraControls target={[modelPos.x, modelPos.y, modelPos.z]} />
          </Suspense>
        </XR>
      </Canvas>

      {/* Exit AR */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition"
      >
        Exit AR
      </button>

      {/* Control Panel */}
      <div className="fixed bottom-0 w-full bg-white p-4 space-y-4 overflow-y-auto max-h-[40vh]">
        <DimensionControls
          width={width}
          height={height}
          depth={depth}
          setWidth={setWidth}
          setHeight={setHeight}
          setDepth={setDepth}
          modelPos={modelPos}
          setModelPos={setModelPos}
          numDrawers={numDrawers}
          setNumDrawers={setNumDrawers}
        />
        <PartControls visibility={visibility} setVisibility={setVisibility} />
        <TextureControls textures={textures} setTextures={setTextures} />
        <BackgroundSelectorUI bg={bg} setBg={setBg} />
      </div>
    </div>
  );
}
