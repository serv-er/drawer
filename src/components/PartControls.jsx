import React from "react";

export default function PartControls({ visibility, setVisibility }) {
  const parts = ["frame", "drawer", "handle", "leg"];
  return (
    <div className="space-y-2">
      {parts.map((part) => (
        <label key={part} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibility[part]}
            onChange={() =>
              setVisibility({ ...visibility, [part]: !visibility[part] })
            }
          />
          <span className="capitalize">{part}</span>
        </label>
      ))}
    </div>
  );
}
