import React from "react";
import TextureUploader from "./TextureUploader";
import * as THREE from "three";

export default function TextureControls({ textures, setTextures }) {
  const parts = ["frame", "drawer", "handle", "leg"];
  const presetColors = {
    Wood: "#8B4513",
    Metal: "#AAAAAA",
    Plastic: "#FFD700",
  };

  return (
    <div className="space-y-4">
      {parts.map((part) => (
        <div key={part}>
          <h4 className="font-semibold capitalize">{part} texture</h4>
          <div className="flex space-x-2 mb-2">
            {Object.keys(presetColors).map((c) => (
              <button
                key={c}
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() =>
                  setTextures({
                    ...textures,
                    [part]: { color: presetColors[c], map: null },
                  })
                }
              >
                {c}
              </button>
            ))}
          </div>
          <TextureUploader
            onTextureLoaded={(tex) =>
              setTextures({ ...textures, [part]: { color: "white", map: tex } })
            }
          />
        </div>
      ))}
    </div>
  );
}
