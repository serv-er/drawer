import * as THREE from "three";
import { evalExpr } from "../utils/evalExpr";

export function createGeometry(def = {}, ctx = {}) {
  const type = def.type;
  switch (type) {
    case "box": {
      const w = evalExpr(def.width, ctx) || 1;
      const h = evalExpr(def.height, ctx) || 1;
      const d = evalExpr(def.depth, ctx) || 1;
      return new THREE.BoxGeometry(w, h, d);
    }
    case "sphere": {
      const r = evalExpr(def.radius, ctx) || 0.5;
      return new THREE.SphereGeometry(r, def.widthSegments || 16, def.heightSegments || 12);
    }
    case "cylinder": {
      const top = evalExpr(def.topRadius, ctx) || 0.05;
      const bottom = evalExpr(def.bottomRadius, ctx) || top;
      const height = evalExpr(def.height, ctx) || 0.2;
      return new THREE.CylinderGeometry(top, bottom, height, def.radialSegments || 12);
    }
    default:
      throw new Error("Unknown geometry type: " + type);
  }
}
