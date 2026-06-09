const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const { method = "GET", headers = {}, body, signal } = options;

  const isJson = body && !(body instanceof FormData);
  const res = await fetch(url, {
    method,
    signal,
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : body,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg = data?.message || data || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
