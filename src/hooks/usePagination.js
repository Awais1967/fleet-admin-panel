import { useMemo, useState } from "react";

export default function usePagination({
  total = 0,
  pageSize = 10,
  initialPage = 1,
} = {}) {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(totalPages, Math.max(1, page));

  const range = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return { start, end };
  }, [safePage, pageSize]);

  return {
    page: safePage,
    setPage,
    pageSize,
    totalPages,
    range,
  };
}
