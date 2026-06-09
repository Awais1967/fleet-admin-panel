import React, { useEffect, useState } from "react";
import DriversTable from "../../components/drivers/DriversTable";
import DriverFormModal from "../../components/drivers/DriverFormModal";
import * as driversService from "../../services/drivers.service";
import { useNavigate } from "react-router-dom";

export default function DriversPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const nav = useNavigate();

  // modal
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // add | edit
  const [formInitial, setFormInitial] = useState(null);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const d = await driversService.getDrivers();
    setRows(
      (d || []).map((x) => ({
        id: x.id,
        name: x.name,
        mobile: x.mobile || "—",
        totalInspections: x.totalInspections ?? "—",
        lastActive: x.lastActive || "—",
        status: x.status || "Inactive",
        fatherName: x.fatherName || "",
        cnic: x.cnic || "",
        dob: x.dob || "",
        gender: x.gender || "",
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => (mounted = false);
  }, []);

  const openAdd = () => {
    setFormMode("add");
    setFormInitial(null);
    setFormOpen(true);
  };

  const openEdit = async (row) => {
    setFormMode("edit");
    setEditingDriverId(row.id);
    // Use the row data directly from the table instead of refetching
    // This ensures we get the latest data including any recent updates
    setFormInitial({
      fullName: row.name || "",
      fatherName: row.fatherName || "",
      cnic: row.cnic || "",
      mobile: row.mobile || "",
      dob: row.dob || "",
      gender: row.gender || "",
    });
    setFormOpen(true);
  };

  const onSave = async (payload) => {
    try {
      setSaving(true);
      await driversService.upsertDriver({
        ...payload,
        id: formMode === "edit" ? editingDriverId : null,
      });
      setFormOpen(false);
      setEditingDriverId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DriversTable
        loading={loading}
        rows={rows}
        onViewDetail={(r) => nav(`/drivers/${r.id}`)}
        onAddNew={openAdd}
        onEdit={(r) => openEdit(r)}
      />

      <DriverFormModal
        open={formOpen}
        mode={formMode}
        initialValues={formInitial}
        onClose={() => {
          setFormOpen(false);
          setEditingDriverId(null);
        }}
        onSave={onSave}
        saving={saving}
      />
    </div>
  );
}
