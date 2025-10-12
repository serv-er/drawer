import * as THREE from "three";

export function createMaterial(matKey, matDef = {}, textures = {}) {
  const tex = textures && textures[matKey];
  if (tex && tex instanceof THREE.Texture) {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: tex });
  }
  const color = (matDef && (matDef.defaultColor || matDef.color)) || "#999999";
  return new THREE.MeshStandardMaterial({ color });
}
