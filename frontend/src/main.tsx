import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { routeTree } from "./routeTree.gen";
import { queryClient } from "@/queryClient";
import { NotFoundPage } from "@/pages/NotFoundPage";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultNotFoundComponent: () => <NotFoundPage />,
  defaultErrorComponent: () => <NotFoundPage />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </QueryClientProvider>
  </React.StrictMode>
);
