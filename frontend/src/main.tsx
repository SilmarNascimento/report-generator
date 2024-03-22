import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Login } from './pages/Login.tsx';
import { MainQuestions } from './pages/MainQuestions.tsx';
import { Test } from './pages/test.tsx';
import { MockExams } from './pages/MockExams.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { Subjects } from './pages/Subjects.tsx';
import { ToastContainer } from 'react-toastify';
import { CreateMainQuestion } from "./pages/createMainQuestion.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/subjects",
    element: <Subjects />
  },
  {
    path: "/main-questions",
    element: <MainQuestions />
  },
  {
    path: "/main-questions/create",
    element: <CreateMainQuestion />
  },
  {
    path: "/main-questions/edit/:mainQuestionId",
    element: <CreateMainQuestion />
  },
  {
    path: "/mock-exams",
    element: <MockExams />
  },
  {
    path: "/test",
    element: <Test />
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>,
)
