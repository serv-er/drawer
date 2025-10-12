// generators/cabinetGenerator.js
import * as THREE from "three";

/**
 * Build a cabinet procedurally from parameters and textures
 *
 * params = {
 *  width, height, depth (in meters),
 *  numDrawers,
 *  handleType ('bar' | 'knob')
 * }
 *
 * textures = {
 *  frame, drawer, handle, leg
 * }
 *
 * visibility = {
 *  frame, drawer, handle, leg
 * }
 */
export function buildCabinet(params = {}, textures = {}, visibility = {}) {
  const group = new THREE.Group();

  const w = params.width ?? 1;
  const h = params.height ?? 1.5;
  const d = params.depth ?? 0.6;
  const numDrawers = Math.max(1, params.numDrawers ?? 3);
  const handleType = params.handleType || "bar";

  // Helper: create material
  const mkMat = (tex, colorHex) => {
    if (tex instanceof THREE.Texture) {
      tex.flipY = false;
      tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: tex });
    }
    return new THREE.MeshStandardMaterial({ color: colorHex || 0x888888 });
  };

  const frameMat = mkMat(textures.frame, 0x8b4513);
  const drawerMat = mkMat(textures.drawer, 0x555555);
  const handleMat = mkMat(textures.handle, 0x222222);
  const legMat = mkMat(textures.leg, 0x333333);

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
