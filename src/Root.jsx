import React, { useState } from "react";
import App from "./App.jsx";
import ARApp from "./ARApp.jsx";

export default function Root() {
  const [arMode, setArMode] = useState(false);

  return (
    <>
      {arMode ? (
        <ARApp exitAR={() => setArMode(false)} />
      ) : (
        <App enterAR={() => setArMode(true)} />
      )}
    </>
  );
}
