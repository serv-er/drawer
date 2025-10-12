// src/App.jsx (REPLACE with this final, robust code)

import React, { Suspense, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { ARButton, XR } from "@react-three/xr";
import Webcam from "react-webcam";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Your project components
import Cabinet from "./components/Cabinet";
import PartControls from "./components/PartControls";
import TextureControls from "./components/TextureControls";
import DimensionControls from "./components/DimensionControls";
import CameraControls from "./components/CameraControls";
import CanvasBackground from "./components/CanvasBackground";
import BackgroundSelectorUI from "./components/BackgroundSelectorUI";
import { useARSupport } from "./hooks/useARSupport";
import { buildCabinet } from "./generators/cabinetGenerator";

const uiToMeters = (uiVal) => uiVal / 100;

function MobileTouchPanel({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-xs flex items-center justify-center shadow-lg"
      >
        {title.substring(0, 4)}
      </button>
      <div
        className={`absolute right-16 top-0 bg-white p-4 rounded-lg shadow-lg transition-all duration-300 origin-right ${
          open
            ? "w-72 opacity-100 scale-100"
            : "w-0 opacity-0 scale-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function App(props) {
  const { showAR, setShowAR } = props;
  const isArSupported = useARSupport();
  const [menuOpen, setMenuOpen] = useState(false);

  const params = useMemo(
    () => ({
      width: uiToMeters(props.width),
      height: uiToMeters(props.height),
      depth: uiToMeters(props.depth),
      numDrawers: props.numDrawers,
    }),
    [props.width, props.height, props.depth, props.numDrawers]
  );

  const handleExport = () => {
    toast.loading("Generating GLB...", { id: "export" });
    setTimeout(() => {
      try {
        const group = buildCabinet(params, props.textures, props.visibility);
        const exporter = new GLTFExporter();
        exporter.parse(
          group,
          (result) => {
            const blob = new Blob([result], { type: "model/gltf-binary" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `cabinet_${Date.now()}.glb`;
            link.click();
            toast.success("GLB Downloaded!", { id: "export" });
          },
          (error) => {
            console.error("GLB export failed:", error);
            toast.error("Export failed. Check console.", { id: "export" });
          },
          { binary: true }
        );
      } catch (err) {
        console.error("Error during export setup:", err);
        toast.error("Export setup failed.", { id: "export" });
      }
    }, 100);
  };

  const Scene = () => (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Cabinet position={[props.modelPos.x, props.modelPos.y, props.modelPos.z]} params={params} textures={props.textures} visibility={props.visibility} />
      </Suspense>
    </>
  );

  const AllControls = () => (
    <>
      <DimensionControls {...props} />
      <PartControls {...props} />
      <TextureControls {...props} />
      <BackgroundSelectorUI {...props} />
    </>
  );

  if (showAR) {
    const SharedARControls = () => (
       <div className="fixed bottom-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-sm p-4 space-y-4 overflow-y-auto max-h-[50vh] z-50">
          <AllControls />
       </div>
    );
    if (isArSupported) {
      return (
        <>
          <ARButton className="absolute top-4 left-4 z-50" />
          <Canvas><XR><Scene /></XR></Canvas>
          <button onClick={() => setShowAR(false)} className="absolute top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg">Exit</button>
          <SharedARControls />
        </>
      );
    } else {
      // --- FALLBACK AR WITH ERROR HANDLING ---
      return (
        <div className="w-screen h-screen">
          <Webcam
            audio={false}
            videoConstraints={{ facingMode: "environment" }}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            // --- THIS IS THE NEW, CRITICAL PART ---
            onUserMediaError={(err) => {
              console.error("Webcam Error:", err);
              toast.error(`Camera Error: ${err.name}. Please grant camera permissions.`, { duration: 5000 });
              setShowAR(false); // Go back to the main view on error
            }}
          />
          <Canvas gl={{ alpha: true }} camera={{ position: [3, 3, 6], fov: 50 }} className="absolute top-0 left-0 z-10">
            <Scene />
            <OrbitControls target={[props.modelPos.x, props.modelPos.y, props.modelPos.z]} />
          </Canvas>
          <button onClick={() => setShowAR(false)} className="absolute top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg">Exit</button>
          <SharedARControls />
        </div>
      );
    }
  }

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button onClick={() => setShowAR(true)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">View in AR</button>
        <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Download GLB</button>
      </div>
      <Canvas camera={{ position: [3, 3, 6], fov: 50 }} shadows>
        <CanvasBackground bg={props.bg} />
        {props.bg === "hdri" && <Environment preset="sunset" />}
        <Scene />
        <CameraControls target={[props.modelPos.x, props.modelPos.y, props.modelPos.z]} />
      </Canvas>
      <div className="hidden md:block">
        <button onClick={() => setMenuOpen(true)} className="fixed top-4 left-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75">☰</button>
        <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setMenuOpen(false)} className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300">✕</button>
          <div className="p-4 space-y-4 overflow-y-auto h-full pt-12"><AllControls /></div>
        </div>
      </div>
      <div className="md:hidden fixed right-0 top-20 flex flex-col space-y-2 z-50">
          <MobileTouchPanel title="Size"><DimensionControls {...props} /></MobileTouchPanel>
          <MobileTouchPanel title="Parts"><PartControls {...props} /></MobileTouchPanel>
          <MobileTouchPanel title="Texture"><TextureControls {...props} /></MobileTouchPanel>
          <MobileTouchPanel title="BG"><BackgroundSelectorUI {...props} /></MobileTouchPanel>
      </div>
    </div>
  );
}