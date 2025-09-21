import {
  Breadcrumb as ShadBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { useRouterState } from "@tanstack/react-router";
import IconeHome from "../ui/IconeHome";
import React from "react";

const routeMap: Record<string, string> = {
  formulario: "Formulário",
  configuracoes: "Configurações",
  configuracao: "Configuração",
  servico: "Serviço",
  servicos: "Serviços",
  "motivo-bloqueio": "Motivo de Bloqueio",
  "motivos-bloqueio": "Motivos de Bloqueio",
};

const Breadcrumb = () => {
  const location = useRouterState({
    select: (state) => state.location,
  });

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const filteredSegments =
    pathSegments.length > 1 &&
    /^\d+$/.test(pathSegments[pathSegments.length - 1])
      ? pathSegments.slice(0, -1)
      : pathSegments;

  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const isLast = index === filteredSegments.length - 1;
    const segmentParts = segment.split("-");
    const labelParts: string[] = [];
    let i = 0;

    while (i < segmentParts.length) {
      let matched = false;

      for (let j = segmentParts.length; j > i; j--) {
        const candidate = segmentParts.slice(i, j).join("-");
        if (routeMap[candidate]) {
          labelParts.push(routeMap[candidate]);
          i = j;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const word = segmentParts[i];
        labelParts.push(word.charAt(0).toUpperCase() + word.slice(1));
        i++;
      }
    }

    return {
      label: labelParts.join(" "),
      isLast,
    };
  });

  return (
    <ShadBreadcrumb className="mt-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/" className="text-[#7F86A0]">
              <IconeHome />
            </a>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map(({ label, isLast }) => (
          <React.Fragment key={label}>
            <BreadcrumbSeparator>
              <span className="text-[#7F86A0]">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="text-[#0034B7]">
                  {label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="text-[#7F86A0]">
                  {label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
};

export default Breadcrumb;
