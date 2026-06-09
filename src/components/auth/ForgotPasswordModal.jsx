// src/components/auth/ForgotPasswordModal.jsx
import React, { useState } from "react";
import Modal from "../shared/Modal";
import TextField from "../shared/TextField";
import Button from "../shared/Button";
import Alert from "../shared/Alert";

export default function ForgotPasswordModal({ open, onClose, onSent }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const handleSend = async () => {
    setErr("");
    if (!email.trim()) {
      setErr("Email is required");
      return;
    }
    // mock
    onSent?.(email.trim());
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title="Forgot Password"
      onClose={onClose}
      maxWidth="520px"
    >
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
          <Button onClick={handleSend}>Send Code</Button>
        </div>
      </div>
    </Modal>
  );
}
