// src/Root.jsx (REPLACE with this code)

import React, { useState } from "react";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

export default function Root() {
  // All state is now lifted to here!
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
  const [showAR, setShowAR] = useState(false);

  // We pass down all state and setters in a single object
  const appState = {
    width, setWidth,
    height, setHeight,
    depth, setDepth,
    numDrawers, setNumDrawers,
    modelPos, setModelPos,
    visibility, setVisibility,
    textures, setTextures,
    bg, setBg,
    showAR, setShowAR,
  };

  return (
    <>
      <App {...appState} />
      <Toaster position="top-center" />
    </>
  );
}