import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "@/queryClient";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//     errorElement: <NotFoundPage />,
//   },

//   {
//     path: "/students-response",
//     element: <StudentsResponses />,
//   },

//   {
//     path: "/test",
//     element: <Test />,
//   },
// ]);

const router = createRouter({ routeTree, context: { queryClient } });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>
);
