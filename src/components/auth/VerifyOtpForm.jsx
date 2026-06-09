// src/components/auth/VerifyOtpForm.jsx
import React, { useState } from "react";
import TextField from "../shared/TextField";
import Button from "../shared/Button";
import Alert from "../shared/Alert";

export default function VerifyOtpForm({ onVerify, onResend }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const handleVerify = async () => {
    setErr("");
    if (code.trim().length < 4) return setErr("Please enter a valid code");
    await onVerify?.(code.trim());
  };

  return (
    <div className="space-y-4">
      {err ? <Alert type="danger">{err}</Alert> : null}

      <TextField
        label="Verification Code"
        value={code}
        onChange={setCode}
        placeholder="Enter code"
      />

      <div className="flex items-center gap-3">
        <Button onClick={handleVerify}>Verify</Button>
        <Button variant="outline" onClick={onResend}>
          Resend Code
        </Button>
      </div>
    </div>
  );
}
