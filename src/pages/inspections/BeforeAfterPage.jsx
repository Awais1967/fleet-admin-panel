// src/pages/inspections/BeforeAfterPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FiChevronLeft, FiDownload, FiSearch, FiSliders } from "react-icons/fi";
import BeforeAfterCompare from "../../components/inspections/BeforeAfterCompare";
import * as inspectionsService from "../../services/inspections.service";

export default function BeforeAfterPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [pair, setPair] = useState(null);

  // (optional) keep issue from query/state (won't render UI block unless you want)
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await inspectionsService.getBeforeAfterByInspectionId(id);
        if (!mounted) return;
        setPair(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const issueFromQuery = qs.get("issue");
    const issueFromState = location.state?.issue;
    setSelectedIssue(issueFromState || issueFromQuery || null);
  }, [location.search, location.state]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header row (matches screenshot layout: left title, centered search, right download) */}
      <div className="flex items-center px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-55">
          <button
            onClick={() => nav(`/inspections/${id}`)}
            className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center"
            aria-label="Back"
          >
            <FiChevronLeft />
          </button>
          <div className="text-sm font-semibold text-slate-900">
            View Details
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="hidden md:block w-full max-w-140">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-12 text-sm outline-none focus:border-teal-600"
              />
              {/* filter icon inside the input (right) */}
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md border border-teal-200 text-teal-700 bg-white hover:bg-teal-50 flex items-center justify-center"
                aria-label="Filter"
              >
                <FiSliders className="text-[14px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="min-w-55 flex justify-end">
          <button
            className="h-10 rounded-md bg-teal-700 text-white text-sm font-medium px-4 hover:bg-teal-800 flex items-center gap-2"
            type="button"
          >
            <FiDownload />
            Download Report
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <BeforeAfterCompare
          loading={loading}
          before={pair?.before}
          after={pair?.after}
          afterBadge={pair?.after?.tag || "Scratch Detected"}
          highlightIssue={selectedIssue}
        />

        {/* Bottom “Damage found” centered pill with big whitespace like screenshot */}
        <div className="pt-16 pb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-6 py-3 text-sm font-medium text-rose-600">
            <span className="h-5 w-5 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 text-xs">!</span>
            </span>
            Damage found
          </span>
        </div>
      </div>
    </div>
  );
}
