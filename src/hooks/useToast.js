import { useCallback } from "react";

const EVT = "app_toast_event";

export function ToastViewport() {
  // Optional: implement UI later; not required for functionality
  return null;
}

export default function useToast() {
  const toast = useCallback(({ type = "info", message = "" }) => {
    window.dispatchEvent(new CustomEvent(EVT, { detail: { type, message } }));
  }, []);

  return { toast };
}
