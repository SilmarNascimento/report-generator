import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <h1 className="text-xl font-bold">Página não encontrada</h1>

      <Link to="/mock-exams" className="text-blue-600 hover:underline">
        Ir para Simulados
      </Link>
    </div>
  );
}
