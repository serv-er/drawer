// generators/exportGLB.js
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { buildCabinet } from "./cabinetGenerator";

/**
 * Export a THREE.Group as GLB and download
 */
export async function exportCabinetGLB(params, textures, visibility, filename = "cabinet.glb") {
  return new Promise((resolve, reject) => {
    try {
      // Build fresh cabinet group
  
      const group = buildCabinet(params, textures, visibility);

      const exporter = new GLTFExporter();
      exporter.parse(
        group,
        (result) => {
          const blob = result instanceof ArrayBuffer
            ? new Blob([result], { type: "application/octet-stream" })
            : new Blob([JSON.stringify(result)], { type: "application/json" });

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          resolve();
        },
        { binary: true } // binary GLB
      );
    } catch (err) {
      console.error("GLB export failed", err);
      reject(err);
    }
  });
}
