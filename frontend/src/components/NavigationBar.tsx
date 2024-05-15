import { Book, ScrollText, Tags, Presentation, BarChartBig} from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function NavigationBar() {
  const activatedLink = "py-1.5 px-3 text-zinc-100 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent bg-zinc-800";
  const deactivatedLink = "py-1.5 px-3 text-zinc-100 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent transition-colors duration-500 hover:bg-zinc-800";

  return (
    <div className="border-b border-zinc-800 py-4">
      <nav className="flex items-center gap-2 max-w-[1200px] mx-auto">
        <NavLink
          to={"/dash-board"}
          className={({ isActive }) => isActive ? activatedLink : deactivatedLink }
        >
          <Presentation className="size-4" />
          Dashboard
        </NavLink>

        <NavLink
          to={"/mock-exams"}
          className={({ isActive }) => isActive ? activatedLink : deactivatedLink }
        >
          <Book className="size-4" />
          Simulados
        </NavLink>

        <NavLink
          to={"/main-questions"}
          className={({ isActive }) => isActive ? activatedLink : deactivatedLink }
        >
          <ScrollText className="size-4" />
          Questões
        </NavLink>

        <NavLink
          to={"/subjects"}
          className={({ isActive }) => isActive ? activatedLink : deactivatedLink }
        >
          <Tags className="size-4" />
          Assuntos
        </NavLink>

        <NavLink
          to={"/diagnosis"}
          className={({ isActive }) => isActive ? activatedLink : deactivatedLink }
        >
          <BarChartBig className="size-4" />
          Diagnósticos
        </NavLink>
      </nav>
    </div>
  )
}
