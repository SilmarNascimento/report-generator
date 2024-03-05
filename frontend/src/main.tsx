import  { App } from './App.tsx';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Login } from './pages/Login.tsx';
import { MainQuestions } from './pages/MainQuestions.tsx';
import { MockExams } from './pages/MockExams.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { Tags } from './pages/Tags.tsx';

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    errorElement: <NotFoundPage />
  }, {
    path: "/login",
    element: <Login />
  }, {
    path: "/tags",
    element: <Tags />
  }, {
    path: "/main-questions",
    element: <MainQuestions />
  }, {
    path: "/mock-exams",
    element: <MockExams />
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
