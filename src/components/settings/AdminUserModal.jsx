import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function AdminUserModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  if (!open) return null;

  const canSave = name.trim() && email.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      id: `admin_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: "Active",
    });
    setName("");
    setEmail("");
    setRole("Admin");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-180 rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-base font-semibold text-slate-900">
            Add Admin User
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-md hover:bg-slate-100 flex items-center justify-center"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>

            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>

            <Field label="Role">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600 bg-white"
              >
                <option>Admin</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="h-10 min-w-35 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-800 mb-2">{label}</div>
      {children}
    </div>
  );
}
