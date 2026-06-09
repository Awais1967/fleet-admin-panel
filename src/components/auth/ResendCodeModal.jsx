// src/components/auth/ResendCodeModal.jsx
import React, { useState } from "react";
import Modal from "../shared/Modal";
import TextField from "../shared/TextField";
import Button from "../shared/Button";
import Alert from "../shared/Alert";

export default function ResendCodeModal({ open, onClose, onResent }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const handleResend = async () => {
    setErr("");
    if (!email.trim()) return setErr("Email is required");
    onResent?.(email.trim());
    onClose?.();
  };

  return (
    <Modal open={open} title="Resend Code" onClose={onClose} maxWidth="520px">
      <div className="space-y-4">
        {err ? <Alert type="danger">{err}</Alert> : null}
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="Enter email"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResend}>Resend</Button>
        </div>
      </div>
    </Modal>
  );
}
