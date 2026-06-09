import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriversTable from "../../components/drivers/DriversTable";
import DriverFormModal from "../../components/drivers/DriverFormModal";
import ErrorState from "../../components/shared/ErrorState";
import * as driversService from "../../services/drivers.service";

function getDriverErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to the users collection. Update Firestore rules to allow this admin account to read and write driver users.";
  }

  return error?.message || "Unable to load drivers.";
}

export default function DriversPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formInitial, setFormInitial] = useState(null);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const drivers = await driversService.getDrivers();
      setRows(
        (drivers || []).map((driver) => ({
          id: driver.id,
          name: driver.name,
          email: driver.email || "",
          mobile: driver.mobile || "-",
          totalInspections: driver.totalInspections ?? "-",
          lastActive: driver.lastActive || "-",
          status: driver.status || "Inactive",
          fatherName: driver.fatherName || "",
          cnic: driver.cnic || "",
          dob: driver.dob || "",
          gender: driver.gender || "",
        })),
      );
    } catch (ex) {
      setRows([]);
      setError(getDriverErrorMessage(ex));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted) await load();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const openAdd = () => {
    setFormMode("add");
    setFormInitial(null);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setFormMode("edit");
    setEditingDriverId(row.id);
    setFormInitial({
      fullName: row.name || "",
      email: row.email || "",
      fatherName: row.fatherName || "",
      cnic: row.cnic || "",
      mobile: row.mobile || "",
      dob: row.dob || "",
      gender: row.gender || "",
      status: row.status || "Active",
    });
    setFormOpen(true);
  };

  const onSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      await driversService.upsertDriver({
        ...payload,
        id: formMode === "edit" ? editingDriverId : null,
      });
      setFormOpen(false);
      setEditingDriverId(null);
      await load();
    } catch (ex) {
      setError(getDriverErrorMessage(ex));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error ? <ErrorState message={error} /> : null}

      <DriversTable
        loading={loading}
        rows={rows}
        onViewDetail={(row) => nav(`/drivers/${row.id}`)}
        onAddNew={openAdd}
        onEdit={openEdit}
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
