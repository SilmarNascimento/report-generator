import { Control } from "react-hook-form";
import { InputMultiSelectWrapper } from "@/components/Features/form-input/InputMultiSelectWrapper";
import { BadgeDropdownType, DropdownType } from "@/interfaces/general";
import { DashboardFilterFormType } from "@/interfaces/dashboard";
import { useDashboardAvailableYears } from "@/hooks/CRUD/dashboard/useDashboardAvailableYears";
import { useMockExamsByYear } from "@/hooks/CRUD/dashboard/useMockExamsByYear";
import { useStudentMockExams } from "@/hooks/CRUD/dashboard/useStudentMockExams";
import { InputSelectDropdownWrapper } from "../Features/form-input/InputSelectDropdownWrapper";

type DashboardFilterFormProps = {
  control: Control<DashboardFilterFormType>;
  year: string;
  studentId?: string | null;
  isIndividual?: boolean;
};

export function DashboardFilterForm({
  control,
  year,
  studentId = null,
  isIndividual = false,
}: DashboardFilterFormProps) {
  const { data: availableYears = [] } = useDashboardAvailableYears();
  const { data: yearMockExams = [] } = useMockExamsByYear(year, !isIndividual);
  const { data: studentMockExams = [] } = useStudentMockExams(
    isIndividual ? studentId : null,
    year,
  );

  const yearOptions: DropdownType[] = availableYears.map((y) => ({
    label: String(y),
    value: String(y),
  }));

  const mockExams = isIndividual ? studentMockExams : yearMockExams;

  const mockExamOptions: BadgeDropdownType[] = mockExams.map((exam) => ({
    dropdownLabel: `Simulado ${exam.number} — ${exam.name}`,
    displayLabel: exam.name,
    value: exam.id,
  }));

  const isMockExamFilterDisabled = isIndividual && !studentId;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="w-full min-w-36">
        <InputSelectDropdownWrapper
          name="year"
          control={control}
          label="Ano"
          options={yearOptions}
          placeholder="Selecione o ano"
        />
      </div>

      <div className="flex-1 min-w-64">
        <InputMultiSelectWrapper
          name="mockExamIds"
          control={control}
          label="Simulados"
          placeholder={
            isMockExamFilterDisabled
              ? "Selecione um aluno para filtrar os simulados"
              : "Todos os simulados do ano"
          }
          options={mockExamOptions}
          disabled={isMockExamFilterDisabled}
          allowSearch
          showBadges
          noErrorMsg
        />
      </div>
    </div>
  );
}
