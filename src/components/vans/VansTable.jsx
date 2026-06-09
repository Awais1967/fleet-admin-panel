import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiPlus, FiSearch, FiSliders } from "react-icons/fi";
import VansFiltersPopover from "./VansFiltersPopover";
import VanFormModal from "./VanFormModal";
import Pagination from "../shared/Pagination";

const MOCK = Array.from({ length: 60 }).map((_, i) => ({
  id: `van_${i + 1}`,
  vanNumber: `Van-${String((i % 9) + 1).padStart(2, "0")}`,
  vin: `4Y1SL${String(65848 + i)}Z`,
  plateNumber: `ABC-${100 + (i % 900)}`,
  model: "Toyota Hiace",
  assignedDriver:
    i % 3 === 0 ? "Ahmed Ali" : i % 3 === 1 ? "John Doe" : "Rehman",
  status: "active",
}));

export default function VansTable() {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    vanNumber: "",
    vin: "",
    assignedDriver: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // skeleton + lazy load
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const lazyPageSize = 12;

  const filterBtnRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // initial load (skeleton)
    const t = setTimeout(() => {
      setItems(MOCK.slice(0, lazyPageSize));
      setCursor(lazyPageSize);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        setItems((prev) => {
          if (cursor >= MOCK.length) return prev;
          const next = MOCK.slice(cursor, cursor + lazyPageSize);
          return [...prev, ...next];
        });
        setCursor((c) => Math.min(MOCK.length, c + lazyPageSize));
      },
      { rootMargin: "300px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, cursor]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const matchesSearch = (r) => {
      if (!q) return true;
      return (
        r.vanNumber.toLowerCase().includes(q) ||
        r.vin.toLowerCase().includes(q) ||
        r.plateNumber.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q) ||
        r.assignedDriver.toLowerCase().includes(q)
      );
    };

    const matchesFilters = (r) => {
      const a = (s) => (s || "").trim().toLowerCase();
      const fVan = a(filters.vanNumber);
      const fVin = a(filters.vin);
      const fDrv = a(filters.assignedDriver);
      if (fVan && !r.vanNumber.toLowerCase().includes(fVan)) return false;
      if (fVin && !r.vin.toLowerCase().includes(fVin)) return false;
      if (fDrv && !r.assignedDriver.toLowerCase().includes(fDrv)) return false;
      return true;
    };

    return items.filter((r) => matchesSearch(r) && matchesFilters(r));
  }, [items, search, filters]);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setPage(1);
    });
    return () => {
      cancelled = true;
    };
  }, [search, filters, items]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = filtered.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  const openAdd = () => {
    setEditRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditRow(row);
    setModalOpen(true);
  };

  const saveVan = (payload) => {
    if (editRow) {
      setItems((prev) =>
        prev.map((v) => (v.id === editRow.id ? { ...v, ...payload } : v)),
      );
    } else {
      const newItem = {
        id: `van_${Date.now()}`,
        assignedDriver: "—",
        status: "active",
        ...payload,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="text-sm font-semibold text-slate-900">All Vans</div>

        <div className="flex items-center gap-3">
          <div className="relative w-105 hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-12 text-sm outline-none focus:border-teal-600"
            />
            <button
              ref={filterBtnRef}
              onClick={() => setFiltersOpen((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-teal-600 text-teal-700 hover:bg-teal-50 flex items-center justify-center"
            >
              <FiSliders />
            </button>

            <VansFiltersPopover
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              values={filters}
              onChange={setFilters}
              onApply={() => setFiltersOpen(false)}
              onClear={() =>
                setFilters({ vanNumber: "", vin: "", assignedDriver: "" })
              }
              anchorRef={filterBtnRef}
            />
          </div>

          <button
            onClick={openAdd}
            className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-4 hover:bg-teal-700 flex items-center gap-2"
          >
            <FiPlus />+ Add New Van
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* mobile search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-12 text-sm outline-none focus:border-teal-600"
            />
            <button
              ref={filterBtnRef}
              onClick={() => setFiltersOpen((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-teal-600 text-teal-700 hover:bg-teal-50 flex items-center justify-center"
            >
              <FiSliders />
            </button>

            <VansFiltersPopover
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              values={filters}
              onChange={setFilters}
              onApply={() => setFiltersOpen(false)}
              onClear={() =>
                setFilters({ vanNumber: "", vin: "", assignedDriver: "" })
              }
              anchorRef={filterBtnRef}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-7 gap-0 px-4 py-3 text-xs font-semibold text-slate-600 bg-white">
            <div>Van Number</div>
            <div>VIN</div>
            <div>Plate Number</div>
            <div>Model</div>
            <div>Assigned Driver</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : (
            <div className="bg-white">
              {pageRows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-7 px-4 py-4 text-xs text-slate-700"
                >
                  <div>{row.vanNumber}</div>
                  <div className="truncate">{row.vin}</div>
                  <div>{row.plateNumber}</div>
                  <div>{row.model}</div>
                  <div>{row.assignedDriver}</div>
                  <div>
                    <StatusPill status={row.status} />
                  </div>
                  <div>
                    <button
                      onClick={() => openEdit(row)}
                      className="h-8 px-4 rounded-md border border-teal-600 text-teal-700 text-xs font-medium hover:bg-teal-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}

              {/* sentinel for lazy load */}
              <div ref={sentinelRef} className="h-8" />
            </div>
          )}
        </div>
        {total > pageSize ? (
          <div className="px-6 py-3">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        ) : null}
      </div>

      <VanFormModal
        open={modalOpen}
        mode={editRow ? "edit" : "add"}
        initialValue={editRow}
        onClose={() => setModalOpen(false)}
        onSave={saveVan}
      />
    </div>
  );
}

function StatusPill({ status }) {
  const isActive = String(status).toLowerCase() === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-600" : "bg-slate-400",
        ].join(" ")}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function SkeletonRows() {
  return (
    <div className="bg-white">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-7 px-4 py-4">
          {Array.from({ length: 7 }).map((__, j) => (
            <div key={j} className="pr-3">
              <div className="h-3 w-full max-w-35 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
