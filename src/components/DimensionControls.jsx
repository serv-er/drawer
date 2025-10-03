import React from "react";

export default function DimensionControls({
  width, setWidth,
  height, setHeight,
  depth, setDepth,
  numDrawers, setNumDrawers,
  modelPos, setModelPos
}) {
  return (
    <div className="space-y-2">
      <label className="block">
        Width: {width}
        <input type="range" min="50" max="300" value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">
        Height: {height}
        <input type="range" min="50" max="400" value={height} onChange={(e)=>setHeight(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">
        Depth: {depth}
        <input type="range" min="50" max="150" value={depth} onChange={(e)=>setDepth(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">
        Number of Drawers: {numDrawers}
        <input type="range" min="1" max="10" value={numDrawers} onChange={(e)=>setNumDrawers(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">
        Model X: {modelPos.x.toFixed(1)}
        <input type="range" min="-5" max="5" step="0.1" value={modelPos.x} onChange={(e)=>setModelPos({...modelPos, x: parseFloat(e.target.value)})} className="w-full"/>
      </label>
      <label className="block">
        Model Y: {modelPos.y.toFixed(1)}
        <input type="range" min="0" max="5" step="0.1" value={modelPos.y} onChange={(e)=>setModelPos({...modelPos, y: parseFloat(e.target.value)})} className="w-full"/>
      </label>
      <label className="block">
        Model Z: {modelPos.z.toFixed(1)}
        <input type="range" min="-5" max="5" step="0.1" value={modelPos.z} onChange={(e)=>setModelPos({...modelPos, z: parseFloat(e.target.value)})} className="w-full"/>
      </label>
    </div>
  );
}
