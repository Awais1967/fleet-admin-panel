import { useEffect, useRef, useState } from "react";

/**
 * Lazy-load table data (IntersectionObserver).
 * loader({ cursor, limit }) -> Promise<{ rows, nextCursor, hasMore }>
 */
export default function useTableData({
  loader,
  limit = 12,
  initialCursor = 0,
} = {}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await loader({ cursor: initialCursor, limit });
      if (!mounted) return;
      setRows(res.rows || []);
      setCursor(res.nextCursor ?? initialCursor + (res.rows?.length || 0));
      setHasMore(Boolean(res.hasMore));
      setLoading(false);
    })();
    return () => (mounted = false);
  }, [loader, limit, initialCursor]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        const res = await loader({ cursor, limit });
        setRows((prev) => [...prev, ...(res.rows || [])]);
        setCursor(res.nextCursor ?? cursor + (res.rows?.length || 0));
        setHasMore(Boolean(res.hasMore));
      },
      { rootMargin: "300px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loading, hasMore, loader, cursor, limit]);

  return { loading, rows, hasMore, sentinelRef };
}
