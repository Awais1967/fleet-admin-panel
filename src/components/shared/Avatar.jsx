import React from "react";

export default function Avatar({ name = "AA", src, size = 44 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border border-app"
      />
    );
  }

  const initials =
    String(name)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AA";

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold"
    >
      {initials}
    </div>
  );
}
