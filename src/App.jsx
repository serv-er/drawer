import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Cabinet from "./components/Cabinet";
import { buildCabinet } from "./generators/cabinetGenerator";
import PartControls from "./components/PartControls";
import TextureControls from "./components/TextureControls";
import DimensionControls from "./components/DimensionControls";
import CameraControls from "./components/CameraControls";
import CanvasBackground from "./components/CanvasBackground";
import BackgroundSelectorUI from "./components/BackgroundSelectorUI";
import ARApp from "./ARApp";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

// Convert UI slider values (cm) to meters
const uiToMeters = (uiVal) => uiVal / 100;

export default function App() {
  const [width, setWidth] = React.useState(100);
  const [height, setHeight] = React.useState(150);
  const [depth, setDepth] = React.useState(60);
  const [numDrawers, setNumDrawers] = React.useState(3);
  const [modelPos, setModelPos] = React.useState({ x: 0, y: 0, z: 0 });
  const [visibility, setVisibility] = React.useState({
    frame: true,
    drawer: true,
    handle: true,
    leg: true,
  });
  const [textures, setTextures] = React.useState({
    frame: { color: "#8B4513", map: null },
    drawer: { color: "#555", map: null },
    handle: { color: "#222", map: null },
    leg: { color: "#333", map: null },
  });
  const [bg, setBg] = React.useState("black");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showAR, setShowAR] = React.useState(false);

  // Build params in meters
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

  // AR detection
  const handleEnterAR = async () => {
    if (!navigator.xr) {
      toast.error("❌ WebXR not supported. Try on a mobile device.");
      return;
    }
    const supported = await navigator.xr.isSessionSupported("immersive-ar");
    if (!supported) {
      toast.error(
        "⚠️ AR not available. \n👉 Android: Chrome + ARCore\n👉 iPhone: Safari + ARKit"
      );
      return;
    }
    setShowAR(true);
  };

  // Export cabinet as GLB
  const handleExport = async () => {
    try {
      const group = buildCabinet(params, texturesMap, visibility);
      group.rotation.y = Math.PI;

      const exporter = new GLTFExporter();
      exporter.parse(
        group,
        (result) => {
          const blob = new Blob(
            [result instanceof ArrayBuffer ? result : JSON.stringify(result)],
            { type: result instanceof ArrayBuffer ? "model/gltf-binary" : "application/json" }
          );
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `cabinet_${Date.now()}.glb`;
          link.click();
          toast.success("GLB exported!");
        },
        { binary: true }
      );

      group.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        }
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Check console for details.");
    }
  };

  if (showAR) {
    return (
      <ARApp
        width={width}
        height={height}
        depth={depth}
        numDrawers={numDrawers}
        modelPos={modelPos}
        visibility={visibility}
        textures={textures}
        bg={bg}
        setWidth={setWidth}
        setHeight={setHeight}
        setDepth={setDepth}
        setModelPos={setModelPos}
        setNumDrawers={setNumDrawers}
        setVisibility={setVisibility}
        setTextures={setTextures}
        setBg={setBg}
        onExit={() => setShowAR(false)}
      />
    );
  }

  return (
    <div className="w-screen h-screen relative">
      {/* AR & Export buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handleEnterAR}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          View in AR
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Generate & Download GLB
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [3, 3, 6], fov: 50 }}>
        <CanvasBackground bg={bg} />
        {bg === "hdri" && <Environment preset="sunset" />}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Cabinet
          position={[modelPos.x, modelPos.y, modelPos.z]}
          params={params}
          textures={texturesMap}
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
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 bg-gray-200 w-full"
          >
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
            <BackgroundSelectorUI bg={bg} setBg={setBg} />
          </div>
        </div>
      </div>

      {/* Mobile Touch Panels */}
      <div className="md:hidden fixed right-0 top-20 flex flex-col space-y-2 z-50">
        {[
          {
            name: "Dimensions",
            comp: (
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
            ),
          },
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

function MobileTouchPanel({ title, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-gray-200 rounded-full text-xs"
      >
        {title[0]}
      </button>
      <div
        className={`absolute right-12 top-0 bg-white p-2 rounded shadow-lg transition-all duration-300 ${
          open
            ? "w-64 opacity-100 scale-100"
            : "w-0 opacity-0 scale-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
