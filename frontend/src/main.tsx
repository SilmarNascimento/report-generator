import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./pages/Login.tsx";
import { MainQuestions } from "./pages/main-question/MainQuestionsPage.tsx";
import { MockExams } from "./pages/mock-exams/mockExamsPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { Subjects } from "./pages/subject/Subjects.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateMainQuestion } from "./pages/main-question/createMainQuestion.tsx";
import { EditMainQuestion } from "./pages/main-question/editMainQuestion.tsx";
import { AdaptedQuestions } from "./pages/main-question/adapted-questions/adaptedQuestions.tsx";
import { CreateAdaptedQuestion } from "./pages/main-question/adapted-questions/createAdaptedQuestion.tsx";
import { EditAdaptedQuestion } from "./pages/main-question/adapted-questions/editAdaptedQuestion.tsx";
import { EditMockExam } from "./pages/mock-exams/editMockExam.tsx";
import { CreateMockExam } from "./pages/mock-exams/createMockExam.tsx";
import { MockExamMainQuestionManager } from "./pages/mock-exams/main-questions/mainQuestionManager.tsx";
import { MainQuestionSubjectManager } from "./pages/main-question/subject/subjectManager.tsx";
import { MockExamSubjectManager } from "./pages/mock-exams/subject/subjectManager.tsx";
import { GenerateDiagnosis } from "./pages/diagnosis/generateDiagnosisPage.tsx";
import { StudentsResponses } from "./pages/diagnosis/diagnosisPage.tsx";
import { MockExamAnswers } from "./pages/mock-exams/answers/answers.tsx";
import EditStudent from "./pages/student/EditStudent.tsx";
import {
  editStudentLoader,
  viewStudentLoader,
} from "./loader/studentLoader.ts";
import CreateStudent from "./pages/student/CreateStudent.tsx";
import StudentList from "./pages/student/StudentList.tsx";
import StudentView from "./pages/student/StudentView.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/subjects",
    element: <Subjects />,
  },
  {
    path: "/main-questions",
    element: <MainQuestions />,
  },
  {
    path: "/main-questions/create",
    element: <CreateMainQuestion />,
  },
  {
    path: "/main-questions/edit/:mainQuestionId",
    element: <EditMainQuestion />,
  },
  {
    path: "/main-questions/:mainQuestionId/subjects",
    element: <MainQuestionSubjectManager />,
  },
  {
    path: "/main-questions/:mainQuestionId/adapted-questions",
    element: <AdaptedQuestions />,
  },
  {
    path: "/main-questions/:mainQuestionId/adapted-questions/create",
    element: <CreateAdaptedQuestion />,
  },
  {
    path: "/main-questions/:mainQuestionId/adapted-questions/edit/:adaptedQuestionId",
    element: <EditAdaptedQuestion />,
  },
  {
    path: "/mock-exams",
    element: <MockExams />,
  },
  {
    path: "/mock-exams/create",
    element: <CreateMockExam />,
  },
  {
    path: "/mock-exams/edit/:mockExamId",
    element: <EditMockExam />,
  },
  {
    path: "/mock-exams/:mockExamId/subjects",
    element: <MockExamSubjectManager />,
  },
  {
    path: "/mock-exams/:mockExamId/main-questions",
    element: <MockExamMainQuestionManager />,
  },
  {
    path: "/mock-exams/:mockExamId/mock-exam-answers",
    element: <MockExamAnswers />,
  },

  {
    path: "/diagnosis/generate",
    element: <GenerateDiagnosis />,
  },
  {
    path: "/students-response",
    element: <StudentsResponses />,
  },
  {
    path: "/students",
    element: <StudentList />,
  },
  {
    path: "/students/create",
    element: <CreateStudent />,
  },
  {
    path: "/students/edit/:id",
    element: <EditStudent />,
    loader: editStudentLoader(queryClient),
  },
  {
    path: "/students/view/:id",
    element: <StudentView />,
    loader: viewStudentLoader(queryClient),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>,
);
