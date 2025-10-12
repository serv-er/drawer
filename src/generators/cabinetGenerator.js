// src/generators/cabinetGenerator.js (REPLACE with this code)
import * as THREE from "three";

/**
 * Build a cabinet procedurally from parameters and textures
 */
export function buildCabinet(params = {}, textures = {}, visibility = {}) {
  const group = new THREE.Group();

  const w = params.width ?? 1;
  const h = params.height ?? 1.5;
  const d = params.depth ?? 0.6;
  const numDrawers = Math.max(1, params.numDrawers ?? 3);
  const handleType = params.handleType || "bar";

  // --- CRITICAL FIX IS HERE ---
  // This helper function now correctly handles both texture maps AND solid colors.
  const mkMat = (textureInfo, fallbackColor) => {
    // If a texture map exists (from file upload), use it.
    if (textureInfo && textureInfo.map instanceof THREE.Texture) {
      const tex = textureInfo.map;
      tex.flipY = false;
      tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: tex, metalness: 0.1, roughness: 0.8 });
    }
    // Otherwise, use the color from the state.
    if (textureInfo && textureInfo.color) {
      return new THREE.MeshStandardMaterial({ color: textureInfo.color, metalness: 0.1, roughness: 0.8 });
    }
    // If all else fails, use the hardcoded fallback.
    return new THREE.MeshStandardMaterial({ color: fallbackColor, metalness: 0.1, roughness: 0.8 });
  };

  // Pass the entire texture object (e.g., textures.frame) to the helper
  const frameMat = mkMat(textures.frame, "#8B4513");
  const drawerMat = mkMat(textures.drawer, "#555555");
  const handleMat = mkMat(textures.handle, "#222222");
  const legMat = mkMat(textures.leg, "#333333");

  // Frame
  if (visibility.frame ?? true) {
    const frameGeom = new THREE.BoxGeometry(w, h, d);
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.name = "frame";
    group.add(frame);
  }

  // Drawers
  if (visibility.drawer ?? true) {
    const drawerH = h / numDrawers;
    for (let i = 0; i < numDrawers; i++) {
      const y = -h / 2 + drawerH / 2 + i * drawerH;
      const geom = new THREE.BoxGeometry(w * 0.92, drawerH * 0.85, 0.03);
      const mesh = new THREE.Mesh(geom, drawerMat);
      mesh.position.set(0, y, d / 2 + 0.015);
      mesh.name = `drawer_${i}`;
      group.add(mesh);

      // Handle
      if (visibility.handle ?? true) {
        if (handleType === "bar") {
          const handleGeom = new THREE.BoxGeometry(w * 0.3, 0.03, 0.02);
          const handle = new THREE.Mesh(handleGeom, handleMat);
          handle.position.set(0, y, d / 2 + 0.03);
          handle.name = `handle_${i}`;
          group.add(handle);
        } else if (handleType === "knob") {
          const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), handleMat);
          knob.position.set(0, y, d / 2 + 0.025);
          knob.name = `knob_${i}`;
          group.add(knob);
        }
      }
    }
  }

  // Legs
  if (visibility.leg ?? true) {
    const legH = Math.min(0.08, h * 0.08);
    const legGeom = new THREE.CylinderGeometry(0.03, 0.03, legH, 12);
    const legOffsetX = w / 2 - 0.05;
    const legOffsetZ = d / 2 - 0.05;
    const legY = -h / 2 - legH / 2 + 0.02;
    const positions = [
      [-legOffsetX, legY, -legOffsetZ],
      [-legOffsetX, legY, legOffsetZ],
      [legOffsetX, legY, -legOffsetZ],
      [legOffsetX, legY, legOffsetZ],
    ];
    positions.forEach((pos, idx) => {
      const leg = new THREE.Mesh(legGeom, legMat);
      leg.position.set(...pos);
      leg.name = `leg_${idx}`;
      group.add(leg);
    });
  }

  group.userData = { params };
  return group;
}