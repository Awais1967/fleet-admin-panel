// src/components/inspections/BeforeAfterCompare.jsx
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function MetaLines({ meta }) {
  return (
    <div className="space-y-1 text-[12px] text-slate-700">
      {meta.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
}

function ImageSkeleton() {
  return <div className="h-105 w-full bg-slate-200 animate-pulse" />;
}

export default function BeforeAfterCompare({
  loading,
  before,
  after,
  afterBadge = "Scratch Detected",
}) {
  const beforeUrl = before?.url;
  const afterUrl = after?.url;

  const beforeMeta = [
    `Captured On: ${before?.capturedOn || "—"}`,
    `Captured At: ${before?.capturedAt || "—"}`,
    `GPS: ${before?.gps || "—"}`,
    `Device: ${before?.device || "—"}`,
  ];

  const afterMeta = [
    `Captured On: ${after?.capturedOn || "—"}`,
    `Captured At: ${after?.capturedAt || "—"}`,
    `GPS: ${after?.gps || "—"}`,
    `Device: ${after?.device || "—"}`,
  ];

  return (
    <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
      {/* Images block */}
      <div className="p-5">
        <div className="relative rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* BEFORE */}
            <div className="relative bg-slate-100">
              {loading ? (
                <ImageSkeleton />
              ) : (
                <img
                  src={beforeUrl}
                  alt="Before"
                  className="h-105 w-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="absolute bottom-3 left-4 text-white text-[18px] font-semibold drop-shadow">
                Before
              </div>

              {/* vertical divider on large screens */}
              <div className="hidden lg:block absolute top-0 right-0 h-full w-px bg-white/70" />
            </div>

            {/* AFTER */}
            <div className="relative bg-slate-100">
              {loading ? (
                <ImageSkeleton />
              ) : (
                <img
                  src={afterUrl}
                  alt="After"
                  className="h-105 w-full object-cover"
                  loading="lazy"
                />
              )}

              {/* red tag */}
              {!loading && afterBadge ? (
                <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-4 py-2 text-[12px] font-semibold text-white shadow-sm">
                  {afterBadge}
                </span>
              ) : null}

              {/* red rectangle highlight box (optional) */}
              {!loading && after?.box ? (
                <div
                  className="absolute border-2 border-rose-500"
                  style={{
                    left: `${after.box.x}%`,
                    top: `${after.box.y}%`,
                    width: `${after.box.w}%`,
                    height: `${after.box.h}%`,
                  }}
                />
              ) : null}

              <div className="absolute bottom-3 left-4 text-white text-[18px] font-semibold drop-shadow">
                After
              </div>
            </div>
          </div>

          {/* center handle (visual) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center">
              <FiChevronLeft className="text-slate-700 -mr-1" />
              <FiChevronRight className="text-slate-700 -ml-1" />
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-0 border-t border-slate-100 bg-white rounded-b-2xl px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetaLines meta={beforeMeta} />
            <MetaLines meta={afterMeta} />
          </div>
        </div>
      </div>
    </div>
  );
}
