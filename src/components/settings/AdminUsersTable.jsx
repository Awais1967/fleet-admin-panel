import React, { useState, useEffect } from "react";
import AdminUserModal from "./AdminUserModal";
import Pagination from "../shared/Pagination";
import * as settingsService from "../../services/settings.service";

const INIT = [
  {
    id: "a1",
    name: "Super Admin",
    email: "admin@company.com",
    role: "Super Admin",
    status: "Active",
  },
  {
    id: "a2",
    name: "Ali Raza",
    email: "admin@company.com",
    role: "Super Admin",
    status: "Active",
  },
  {
    id: "a3",
    name: "Sana Khan",
    email: "admin@company.com",
    role: "Super Admin",
    status: "Disable",
  },
];

export default function AdminUsersTable() {
  const [rows, setRows] = useState(INIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;

    settingsService
      .getAdmins()
      .then((admins) => {
        if (!cancelled && admins.length) setRows(admins);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setPage(1);
    });
    return () => {
      cancelled = true;
    };
  }, [rows]);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize,
  );

  const toggle = async (id) => {
    const row = rows.find((item) => item.id === id);
    const nextStatus = row?.status === "Active" ? "Disable" : "Active";

    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: nextStatus }
          : r,
      ),
    );

    await settingsService.setAdminStatus(id, nextStatus);
  };

  const addAdmin = async (admin) => {
    const savedAdmin = await settingsService.addAdmin(admin);
    setRows((prev) => [savedAdmin.payload || savedAdmin, ...prev]);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-900">
            Admin Users
          </div>

          <button
            onClick={() => setModalOpen(true)}
            disabled={loading}
            className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-5 hover:bg-teal-700"
          >
            Add Admin User
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-5 text-xs font-semibold text-slate-600 pb-3">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <div className="space-y-4">
            {pageRows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-5 text-xs text-slate-700 items-center"
              >
                <div>{r.name}</div>
                <div>{r.email}</div>
                <div>{r.role}</div>
                <div>
                  <StatusPill status={r.status} />
                </div>
                <div>
                  {r.status === "Active" ? (
                    <button
                      onClick={() => toggle(r.id)}
                      disabled={loading}
                      className="h-8 min-w-22 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
                    >
                      Enable
                    </button>
                  ) : (
                    <button
                      onClick={() => toggle(r.id)}
                      disabled={loading}
                      className="h-8 min-w-22 rounded-md bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
                    >
                      Disable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {total > pageSize ? (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      ) : null}

      <AdminUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addAdmin}
      />
    </>
  );
}

function StatusPill({ status }) {
  const ok = String(status).toLowerCase() === "active";
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium",
        ok ? "bg-teal-50 text-teal-700" : "bg-rose-50 text-rose-600",
      ].join(" ")}
    >
      {ok ? "Active" : "Disable"}
    </span>
  );
}
