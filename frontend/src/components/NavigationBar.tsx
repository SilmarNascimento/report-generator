import {
  Book,
  ScrollText,
  Tags,
  Presentation,
  BarChartBig,
  FilePlus,
  User,
  Users,
} from "lucide-react";
import { Link, useMatchRoute } from "@tanstack/react-router";

export function NavigationBar() {
  const matchRoute = useMatchRoute();

  const activatedLink =
    "py-1.5 px-3 text-zinc-100 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent bg-zinc-800";
  const deactivatedLink =
    "py-1.5 px-3 text-zinc-100 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent transition-colors duration-500 hover:bg-zinc-800";

  function linkClass(to: string) {
    return matchRoute({ to }) ? activatedLink : deactivatedLink;
  }

  return (
    <div className="border-b border-zinc-800 py-4">
      <nav className="flex items-center gap-2 max-w-[1200px] mx-auto">
        <Link to="/" className={linkClass("/")}>
          <Presentation className="size-4" />
          Dashboard
        </Link>

        <Link to="/mock-exams" className={linkClass("/mock-exams")}>
          <Book className="size-4" />
          Simulados
        </Link>

        <Link
          to="/main-questions"
          className={linkClass("/main-questions")}
          search={{
            query: "",
            page: 1,
            pageSize: 10,
          }}
        >
          <ScrollText className="size-4" />
          Questões
        </Link>

        <Link
          to="/subjects"
          className={linkClass("/subjects")}
          search={{
            query: "",
            page: 1,
            pageSize: 10,
          }}
        >
          <Tags className="size-4" />
          Assuntos
        </Link>

        <Link
          to="/diagnosis/generate"
          className={linkClass("/diagnosis/generate")}
        >
          <FilePlus className="size-4" />
          Adicionar Diagnósticos
        </Link>

        <Link to="/diagnosis" className={linkClass("/diagnosis")}>
          <BarChartBig className="size-4" />
          Diagnósticos
        </Link>

        {/* <Link to="/usuarios" className={linkClass("/usuarios")}>
          <User className="size-4" />
          Usuários
        </Link>

        <Link
          to={"/students-response"}
          className={linkClass("/students-response")}
        >
          <Users className="size-4" />
          Perfil
        </Link> */}
      </nav>
    </div>
  );
}
