import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

export default function VanFormModal({
  open,
  mode,
  initialValue,
  onClose,
  onSave,
}) {
  const isEdit = mode === "edit";

  const init = useMemo(
    () => ({
      vanNumber: initialValue?.vanNumber || "",
      vin: initialValue?.vin || "",
      plateNumber: initialValue?.plateNumber || "",
      model: initialValue?.model || "",
      status: initialValue?.status || "Active",
    }),
    [initialValue],
  );

  const [form, setForm] = useState(init);

  useEffect(() => {
    if (!open) return;
    // Defer the state update to avoid calling setState synchronously inside
    // an effect (prevents cascading renders warnings).
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setForm(init);
    });
    return () => {
      cancelled = true;
    };
  }, [open, init]);

  if (!open) return null;

  const canSave =
    form.vanNumber.trim() &&
    form.vin.trim() &&
    form.plateNumber.trim() &&
    form.model.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      ...initialValue,
      vanNumber: form.vanNumber.trim(),
      vin: form.vin.trim(),
      plateNumber: form.plateNumber.trim(),
      model: form.model.trim(),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-205 rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-base font-semibold text-slate-900">
            {isEdit ? "Edit Van" : "Add Van"}
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
            <Field label="Van Number">
              <input
                value={form.vanNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, vanNumber: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>

            <Field label="VIN">
              <input
                value={form.vin}
                onChange={(e) =>
                  setForm((p) => ({ ...p, vin: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>

            <Field label="Plate Number">
              <input
                value={form.plateNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, plateNumber: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>

            <Field label="Model">
              <input
                value={form.model}
                onChange={(e) =>
                  setForm((p) => ({ ...p, model: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-600"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
