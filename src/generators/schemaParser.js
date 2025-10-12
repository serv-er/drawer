import * as THREE from "three";
import { createGeometry } from "../factories/geometryFactory";
import { createMaterial } from "../factories/materialFactory";
import { evalExpr } from "../utils/evalExpr";

/**
 * buildFromSchema(schema, params, textures)
 * schema: loaded JSON object
 * params: object e.g. { width: 1, height: 1.5, depth: 0.6, numDrawers: 3 } (units match schema)
 * textures: { frame: THREE.Texture, drawer: THREE.Texture, ... }
 */
export function buildFromSchema(schema, params = {}, textures = {}) {
  const group = new THREE.Group();
  group.name = schema.id || "generated";

  const parts = schema.parts || [];
  parts.forEach((partDef) => {
    // explicit positions variant
    if (Array.isArray(partDef.positions) && partDef.positions.length) {
      partDef.positions.forEach((posDef, posIndex) => {
        const ctx = { params, index: posIndex };
        const geom = createGeometry(partDef.geometry || {}, ctx);
        const mat = createMaterial(partDef.material, (schema.materials || {})[partDef.material], textures);
        const mesh = new THREE.Mesh(geom, mat);
        const x = evalExpr(posDef.x || 0, ctx) || 0;
        const y = evalExpr(posDef.y || 0, ctx) || 0;
        const z = evalExpr(posDef.z || 0, ctx) || 0;
        mesh.position.set(x, y, z);
        mesh.name = `${partDef.name}_${posIndex}`;
        group.add(mesh);
      });
      return;
    }

    // repeated parts using 'repeat' expression
    let repeatCount = 1;
    if (partDef.repeat) {
      const val = evalExpr(partDef.repeat, { params });
      repeatCount = Math.max(1, Math.round(val || 1));
    }

    for (let i = 0; i < repeatCount; i++) {
      const ctx = { params, index: i };
      const geom = createGeometry(partDef.geometry || {}, ctx);
      const mat = createMaterial(partDef.material, (schema.materials || {})[partDef.material], textures);
      const mesh = new THREE.Mesh(geom, mat);
      const pos = partDef.position || {};
      const x = evalExpr(pos.x || 0, ctx) || 0;
      const y = evalExpr(pos.y || 0, ctx) || 0;
      const z = evalExpr(pos.z || 0, ctx) || 0;
      mesh.position.set(x, y, z);
      mesh.name = `${partDef.name}_${i}`;
      group.add(mesh);
    }
  });

  group.userData = { schemaId: schema.id, params };
  return group;
}
