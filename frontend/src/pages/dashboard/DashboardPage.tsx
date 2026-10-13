import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavigationBar } from "@/components/NavigationBar";
import { DashboardInternalNav } from "@/components/dashboard/DashboardInternalNav";
import { DashboardFilterForm } from "@/components/dashboard/DashboardFilterForm";
import { GlobalDashboard } from "@/components/dashboard/global/GlobalDashboard";
import { IndividualDashboard } from "@/components/dashboard/individual/IndividualDashboard";
import { StudentSelector } from "@/components/dashboard/individual/StudentSelector";
import { DashboardFilterFormType } from "@/interfaces/dashboard";
import PaginaContainer from "@/components/Shared/PaginaContainer";

type DashboardTab = "global" | "individual";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("global");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

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

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setValue("mockExamIds", []);
  };

  const handleStudentChange = (studentId: string | null) => {
    setSelectedStudentId(studentId);
    setValue("mockExamIds", []);
  };

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
          onTabChange={handleTabChange}
        />

        {activeTab === "individual" && (
          <div className="mb-4">
            <StudentSelector
              selectedStudentId={selectedStudentId}
              onStudentChange={handleStudentChange}
            />
          </div>
        )}

        <DashboardFilterForm
          control={control}
          year={year}
          studentId={selectedStudentId}
          isIndividual={activeTab === "individual"}
        />

        {activeTab === "global" ? (
          <GlobalDashboard year={year} mockExamIds={selectedMockExamIds} />
        ) : (
          <IndividualDashboard
            studentId={selectedStudentId}
            year={year}
            mockExamIds={selectedMockExamIds}
          />
        )}
      </PaginaContainer>
    </>
  );
}
