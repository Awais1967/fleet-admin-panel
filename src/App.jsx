import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routeConfig.jsx";

// Optional: if you implemented toast viewport later
// import { ToastViewport } from "./hooks/useToast";

export default function App() {
  const element = useRoutes(routes);

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-app">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        }
      >
        {element}
      </Suspense>

      {/* <ToastViewport /> */}
    </>
  );
}
