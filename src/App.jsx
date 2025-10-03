import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Cabinet from "./components/Cabinet";
import PartControls from "./components/PartControls";
import TextureControls from "./components/TextureControls";
import DimensionControls from "./components/DimensionControls";
import CameraControls from "./components/CameraControls";
import CanvasBackground from "./components/CanvasBackground";
import BackgroundSelectorUI from "./components/BackgroundSelectorUI";

export default function App() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(150);
  const [depth, setDepth] = useState(60);
  const [numDrawers, setNumDrawers] = useState(3);
  const [modelPos, setModelPos] = useState({ x: 0, y: 0, z: 0 });
  const [visibility, setVisibility] = useState({
    frame: true,
    drawer: true,
    handle: true,
    leg: true,
  });
  const [textures, setTextures] = useState({
    frame: { color: "#8B4513", map: null },
    drawer: { color: "#555", map: null },
    handle: { color: "#222", map: null },
    leg: { color: "#333", map: null },
  });
  const [bg, setBg] = useState("black");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [3, 3, 6], fov: 50 }}>
        {/* Canvas background controlled here */}
        <CanvasBackground bg={bg} />
        {bg === "hdri" && <Environment preset="sunset" />}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
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
      </Canvas>

      {/* Desktop Hamburger Menu */}
      <div className="hidden md:block">
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded"
        >
          ☰
        </button>
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-200 w-full">
            Close
          </button>
          <div className="p-4 space-y-4 overflow-y-auto h-full">
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
            {/* Desktop background buttons */}
            <BackgroundSelectorUI bg={bg} setBg={setBg} />
          </div>
        </div>
      </div>

      {/* Mobile Vertical Touch Panel */}
      <div className="md:hidden fixed right-0 top-20 flex flex-col space-y-2 z-50">
        {[
          { name: "Dimensions", comp: (
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
          ) },
          { name: "Parts", comp: <PartControls visibility={visibility} setVisibility={setVisibility} /> },
          { name: "Textures", comp: <TextureControls textures={textures} setTextures={setTextures} /> },
          { name: "Background", comp: <BackgroundSelectorUI bg={bg} setBg={setBg} /> },
        ].map((item) => (
          <MobileTouchPanel key={item.name} title={item.name}>
            {item.comp}
          </MobileTouchPanel>
        ))}
      </div>
    </div>
  );
}

// Mobile touch panel component
function MobileTouchPanel({ title, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-gray-200 rounded-full text-xs rotate-0 transform transition-all duration-300"
      >
        {title[0]}
      </button>
      <div
        className={`absolute right-12 top-0 bg-white p-2 rounded shadow-lg transition-all duration-300 ${
          open ? "w-64 opacity-100 scale-100" : "w-0 opacity-0 scale-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
