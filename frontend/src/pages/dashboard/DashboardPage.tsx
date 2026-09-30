import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavigationBar } from "@/components/NavigationBar";
import { DashboardInternalNav } from "@/components/dashboard/DashboardInternalNav";
import { DashboardFilterForm } from "@/components/dashboard/DashboardFilterForm";
import { GlobalDashboard } from "@/components/dashboard/global/GlobalDashboard";
import { IndividualDashboard } from "@/components/dashboard/individual/IndividualDashboard";
import { DashboardFilterFormType } from "@/interfaces/dashboard";
import PaginaContainer from "@/components/Shared/PaginaContainer";

type DashboardTab = "global" | "individual";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("global");

  const { control, watch, setValue } = useForm<DashboardFilterFormType>({
    defaultValues: {
      year: String(new Date().getFullYear()),
      mockExamIds: [],
    },
  });

  const { year, mockExamIds } = watch();

  useEffect(() => {
    setValue("mockExamIds", []);
  }, [year, setValue]);

  const selectedMockExamIds = mockExamIds.map((opt) => opt.value);

  return (
    <>
      <NavigationBar />
      <PaginaContainer className="space-y-0 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho dos alunos nos simulados
          </p>
        </div>

        <DashboardInternalNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DashboardFilterForm control={control} year={year} />

        {activeTab === "global" ? (
          <GlobalDashboard year={year} mockExamIds={selectedMockExamIds} />
        ) : (
          <IndividualDashboard year={year} mockExamIds={selectedMockExamIds} />
        )}
      </PaginaContainer>
    </>
  );
}
