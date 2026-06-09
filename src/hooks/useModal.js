import { useCallback, useState } from "react";

export default function useModal(initial = false) {
  const [open, setOpen] = useState(initial);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return { open, setOpen, onOpen, onClose, toggle };
}
