import React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function ImageLightbox({ open, src, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-80">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-5xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white inline-flex items-center gap-2"
          >
            <FiX /> Close
          </button>
          <img
            src={src}
            alt="preview"
            className="w-full rounded-xl bg-white object-contain"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
