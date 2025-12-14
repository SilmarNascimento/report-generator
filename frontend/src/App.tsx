import { Outlet } from "@tanstack/react-router";

export function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Outlet />
    </div>
  );
}
