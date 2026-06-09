import React, { useEffect } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
} from "react-icons/fi";

export default function Lightbox({
  images = [],
  index = 0,
  open,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  const src = images[index]?.url || images[index];

  function openFull() {
    if (!src) return;
    window.open(src, "_blank", "noopener,noreferrer");
  }

  function download() {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = "image";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={download}
          className="rounded-md bg-white/90 p-2 text-slate-700 hover:bg-white"
          title="Download"
        >
          <FiDownload />
        </button>

        <button
          onClick={openFull}
          className="rounded-md bg-white/90 p-2 text-slate-700 hover:bg-white"
          title="Open full size in new tab"
        >
          <FiExternalLink />
        </button>

        <button
          onClick={onClose}
          className="rounded-md bg-white/90 p-2 text-slate-700 hover:bg-white"
          aria-label="Close"
        >
          <FiX />
        </button>
      </div>

      <button
        onClick={onPrev}
        className="absolute left-4 z-50 rounded-md bg-white/90 p-2 text-slate-700 hover:bg-white"
        aria-label="Previous"
      >
        <FiChevronLeft />
      </button>

      <div className="max-w-[95vw] max-h-[90vh] overflow-auto p-4">
        <img
          src={src}
          alt="photo"
          className="w-auto h-auto max-w-none max-h-none rounded-md shadow-lg block"
        />
      </div>

      <button
        onClick={onNext}
        className="absolute right-4 z-50 rounded-md bg-white/90 p-2 text-slate-700 hover:bg-white"
        aria-label="Next"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
