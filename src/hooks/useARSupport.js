// src/hooks/useARSupport.js
import { useEffect, useState } from "react";

export function useARSupport() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-ar")
        .then((res) => setSupported(res))
        .catch(() => setSupported(false));
    } else {
      setSupported(false);
    }
  }, []);

  return supported;
}
