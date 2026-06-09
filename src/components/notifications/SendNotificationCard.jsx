import React, { useMemo, useState } from "react";
import RecipientsMultiSelect from "./RecipientsMultiSelect";
import * as notificationsService from "../../services/notifications.service";

export default function SendNotificationCard({ drivers = [], onSent, onError }) {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState([]); // empty => All
  const [sms, setSms] = useState(true);
  const [inApp, setInApp] = useState(false);
  const [sending, setSending] = useState(false);

  const options = useMemo(
    () => drivers.map((d) => ({ id: d.id, label: d.name })),
    [drivers],
  );

  const canSend = message.trim() && (sms || inApp);

  const handleSend = async () => {
    if (!canSend) return;

    const selectedOptions =
      recipients.length === 0
        ? options
        : options.filter((option) => recipients.includes(option.id));

    try {
      setSending(true);
      await notificationsService.sendNotification({
        message: message.trim(),
        recipientIds: recipients,
        recipientNames: selectedOptions.map((option) => option.label),
        sentTo:
          recipients.length === 0
            ? "All Driver"
            : selectedOptions.map((option) => option.label).join(", "),
        sms,
        inApp,
        status: "Delivered",
      });
      setMessage("");
      setRecipients([]);
      onSent?.();
    } catch (ex) {
      onError?.(ex);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">
          Send Notification
        </div>
      </div>

      <div className="px-6 py-6">
        <Field label="Message">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write Here"
            className="min-h-23 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-teal-600 resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          <Field label="Recipients">
            <RecipientsMultiSelect
              value={recipients}
              onChange={setRecipients}
              options={options}
              placeholder="All Driver"
            />
          </Field>

          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">
              Channel
            </div>
            <div className="flex items-center gap-7 pt-2">
              <label className="flex items-center gap-3 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={sms}
                  onChange={(e) => setSms(e.target.checked)}
                  className="h-4 w-4 accent-teal-600"
                />
                SMS
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={inApp}
                  onChange={(e) => setInApp(e.target.checked)}
                  className="h-4 w-4 accent-teal-600"
                />
                In App
              </label>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-6 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
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
