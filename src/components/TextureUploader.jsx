import React from "react";
import * as THREE from "three";

export default function TextureUploader({ onTextureLoaded }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const loader = new THREE.TextureLoader();
      loader.load(event.target.result, (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        onTextureLoaded(texture);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Upload Custom Texture:</label>
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}
