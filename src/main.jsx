import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Root from "./Root.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
       <Toaster position="top-center" />
  </React.StrictMode>
);
