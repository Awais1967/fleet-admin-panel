import React, { useMemo, useState } from "react";
import Lightbox from "./Lightbox";

function ImgSkeleton() {
  return <div className="h-48 w-full rounded-lg bg-slate-200 animate-pulse" />;
}

/**
 * photos: [{ id, url, tag?: "Scratch Detected" }]
 * onSelect(photo) -> open lightbox or navigate
 */
export default function InspectionPhotosGrid({
  loading,
  photos = [],
  aiStatus,
  onSelect,
}) {
  const list = useMemo(() => photos || [], [photos]);
  const isClear = aiStatus && aiStatus.toLowerCase() === "clear";
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function openAt(i) {
    setIndex(i);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function prev() {
    setIndex((s) => (s - 1 + list.length) % list.length);
  }

  function next() {
    setIndex((s) => (s + 1) % list.length);
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <ImgSkeleton key={i} />)
          : list.map((p, i) => (
              <button
                key={p.id || i}
                type="button"
                onClick={() => {
                  if (onSelect) onSelect(p);
                  else openAt(i);
                }}
                className="relative overflow-hidden rounded-lg bg-slate-100 shadow-sm focus:outline-none"
              >
                <img
                  src={p.url}
                  alt=""
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />

                {!isClear && (p.tag || p.tagLabel || p.tagged) ? (
                  <span className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
                    {p.tag ||
                      p.tagLabel ||
                      (p.tagged ? "Scratch Detected" : "")}
                  </span>
                ) : null}
              </button>
            ))}
      </div>

      <Lightbox
        images={list}
        index={index}
        open={open}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
