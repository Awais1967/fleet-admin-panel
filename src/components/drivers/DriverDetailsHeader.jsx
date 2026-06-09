import React, { useMemo } from "react";
import { FiChevronLeft } from "react-icons/fi";

const PRIMARY = "#0A8F86";

function getInitials(name) {
  const txt = String(name || "").trim();
  const parts = txt.split(" ").filter(Boolean);
  const a = (parts[0] || "A")[0];
  const b = (parts[1] || parts[0] || "A")[0];
  return (a + b).toUpperCase();
}

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  const isActive = v === "active";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${
        isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {value}
    </span>
  );
}

function SkeletonLine({ w = "w-40" }) {
  return <div className={`h-3 ${w} rounded bg-slate-100 animate-pulse`} />;
}

export default function DriverDetailsHeader({
  embedded = false,
  loading = false,
  driver,
  onBack,
  onEdit,
  onDisable,
  rightActionLabel = "Disable Driver",
}) {
  const initials = useMemo(() => getInitials(driver?.name), [driver?.name]);

  const content = (
    <>
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-700"
        >
          <FiChevronLeft />
          View Details
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="h-8 rounded-md px-4 text-[11px] font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Edit Profile
          </button>

          <button
            type="button"
            onClick={onDisable}
            className="h-8 rounded-md px-4 text-[11px] font-semibold border"
            style={{ borderColor: PRIMARY, color: PRIMARY }}
          >
            {rightActionLabel}
          </button>
        </div>
      </div>

      {/* profile row */}
      <div className="px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? "AA" : initials}
            </div>

            <div>
              <div className="text-[14px] font-semibold text-slate-800">
                {loading ? <SkeletonLine w="w-44" /> : driver?.name || "-"}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-10 gap-y-1 text-[12px] text-slate-600">
                <div>Mobile</div>
                <div className="text-slate-700">
                  {loading ? <SkeletonLine w="w-32" /> : driver?.mobile || "-"}
                </div>

                <div>Email</div>
                <div className="text-slate-700">
                  {loading ? <SkeletonLine w="w-48" /> : driver?.email || "-"}
                </div>

                <div>Date Of Birth</div>
                <div className="text-slate-700">
                  {loading ? <SkeletonLine w="w-28" /> : driver?.dob || "-"}
                </div>

                <div>CNIC No</div>
                <div className="text-slate-700">
                  {loading ? <SkeletonLine w="w-40" /> : driver?.cnic || "-"}
                </div>

                <div>Join Date</div>
                <div className="text-slate-700">
                  {loading ? (
                    <SkeletonLine w="w-28" />
                  ) : (
                    driver?.joinDate || "-"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
            {loading ? (
              <div className="h-6 w-20 rounded-full bg-slate-100 animate-pulse" />
            ) : (
              <StatusPill value={driver?.status || "Active"} />
            )}

            <div className="text-[12px] text-slate-600">
              Last Active{" "}
              <span className="text-slate-800 font-medium ml-2">
                {loading
                  ? "—"
                  : driver?.lastActiveDate || driver?.lastActive || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm overflow-hidden">
      {content}
    </div>
  );
}
