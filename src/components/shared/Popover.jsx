import React, { useEffect, useRef, useState } from "react";

export default function Popover({ trigger, content, align = "right" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative inline-block">
      {trigger({
        open,
        toggle: () => setOpen((v) => !v),
        close: () => setOpen(false),
      })}

      {open ? (
        <div
          className={`absolute z-50 mt-2 ${align === "left" ? "left-0" : "right-0"}`}
        >
          {content({ close: () => setOpen(false) })}
        </div>
      ) : null}
    </div>
  );
}
