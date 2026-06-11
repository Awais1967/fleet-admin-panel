import React, { useEffect, useMemo, useState } from "react";
import { FiX, FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";

const PRIMARY = "#0A8F86";

const empty = {
  fullName: "",
  fatherName: "",
  cnic: "",
  email: "",
  password: "",
  mobile: "",
  dob: "",
  gender: "",
  status: "Active",
};

function Label({ children }) {
  return (
    <div className="text-[12px] font-semibold text-slate-700 mb-2">
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, rightIcon, type = "text" }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-slate-300 ${
          rightIcon ? "pr-10" : ""
        }`}
      />
      {rightIcon ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          {rightIcon}
        </div>
      ) : null}
    </div>
  );
}

function Select({ value, onChange, options, placeholder = "Select" }) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-10 text-[12px] text-slate-700 outline-none focus:border-slate-300"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[14px]" />
    </div>
  );
}

/**
 * open, mode: "add" | "edit"
 * initialValues: object
 * onClose()
 * onSave(payload)
 */
export default function DriverFormModal({
  open,
  mode = "add",
  initialValues,
  onClose,
  onSave,
}) {
  const init = useMemo(
    () => ({ ...empty, ...(initialValues || {}) }),
    [initialValues],
  );

  const [form, setForm] = useState(init);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setForm(init);
        setShowPassword(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, init]);

  if (!open) return null;

  const title = mode === "edit" ? "Edit Driver" : "Add Driver";
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-180 rounded-[10px] bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-[14px] font-semibold text-slate-800">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-slate-50"
            aria-label="Close"
          >
            <FiX className="text-slate-600" />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.fullName}
                onChange={(v) => update("fullName", v)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
              />
            </div>

            {mode === "add" ? (
              <div>
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(v) => update("password", v)}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="flex h-5 w-5 items-center justify-center text-slate-500 hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />
              </div>
            ) : null}

            <div>
              <Label>Father Name</Label>
              <Input
                value={form.fatherName}
                onChange={(v) => update("fatherName", v)}
              />
            </div>

            <div>
              <Label>CNIC Number</Label>
              <Input value={form.cnic} onChange={(v) => update("cnic", v)} />
            </div>

            <div>
              <Label>Mobile Number</Label>
              <Input
                value={form.mobile}
                onChange={(v) => update("mobile", v)}
              />
            </div>

            <div>
              <Label>Date Of Birth</Label>
              {/* ✅ FIX: removed rightIcon (native date input already has calendar) */}
              <Input
                type="date"
                value={form.dob}
                onChange={(v) => update("dob", v)}
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                placeholder="Select"
                value={form.gender}
                onChange={(v) => update("gender", v)}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Status</Label>
              <Select
                placeholder={null}
                value={form.status || "Active"}
                onChange={(v) => update("status", v)}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => onSave?.(form)}
              className="h-9 rounded-md px-10 text-[12px] font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
