import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

const Logout = lazyRouteComponent(() => import("@/pages/Logout"));

export const Route = createFileRoute("/logout")({
  component: Logout,
});
