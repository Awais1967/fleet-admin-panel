import React from "react";
import Popover from "./Popover";
import Button from "./Button";

export default function FiltersPopover({
  trigger,
  title = "Filter",
  children,
}) {
  return (
    <Popover
      trigger={trigger}
      content={({ close }) => (
        <div className="w-90 bg-white rounded-xl border border-app shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-app">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
          </div>
          <div className="px-5 py-4 space-y-4">
            {children}
            <div className="pt-2 flex gap-3">
              <Button className="flex-1" onClick={close}>
                Apply
              </Button>
              <Button variant="outline" className="flex-1" onClick={close}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    />
  );
}
