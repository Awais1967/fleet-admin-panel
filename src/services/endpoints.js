export const endpoints = {
  overview: {
    kpis: "/overview/kpis",
    todaysInspections: "/overview/today",
    damageAlerts: "/overview/alerts",
  },
  inspections: {
    list: "/inspections",
    byId: (id) => `/inspections/${id}`,
    beforeAfter: (id) => `/inspections/${id}/before-after`,
  },
  drivers: {
    list: "/drivers",
    byId: (id) => `/drivers/${id}`,
  },
  vans: {
    list: "/vans",
    byId: (id) => `/vans/${id}`,
  },
  assignments: {
    daily: "/assignments/daily",
    bulk: "/assignments/bulk",
    history: "/assignments/history",
  },
  analytics: {
    kpis: "/analytics/kpis",
  },
  notifications: {
    send: "/notifications/send",
    history: "/notifications/history",
  },
  settings: {
    retention: "/settings/retention",
    admins: "/settings/admins",
  },
};
