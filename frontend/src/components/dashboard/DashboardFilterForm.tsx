import { Control, Controller } from "react-hook-form";
import { InputMultiSelectWrapper } from "@/components/Features/form-input/InputMultiSelectWrapper";
import UnifiedDropdown from "@/components/Features/UnifiedDropdown";
import { Label } from "@/components/ui/shadcn/Label";
import { BadgeDropdownType, DropdownType } from "@/interfaces/general";
import { DashboardFilterFormType } from "@/interfaces/dashboard";
import { useDashboardAvailableYears } from "@/hooks/CRUD/dashboard/useDashboardAvailableYears";
import { useMockExamsByYear } from "@/hooks/CRUD/dashboard/useMockExamsByYear";

type DashboardFilterFormProps = {
  control: Control<DashboardFilterFormType>;
  year: string;
};

export function DashboardFilterForm({ control, year }: DashboardFilterFormProps) {
  const { data: availableYears = [] } = useDashboardAvailableYears();
  const { data: mockExams = [] } = useMockExamsByYear(year);

  const yearOptions: DropdownType[] = availableYears.map((y) => ({
    label: String(y),
    value: String(y),
  }));

  const mockExamOptions: BadgeDropdownType[] = mockExams.map((exam) => ({
    dropdownLabel: `Simulado ${exam.number} — ${exam.name}`,
    displayLabel: exam.name,
    value: exam.id,
  }));

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-1.5 min-w-36">
        <Label className="text-sm font-medium text-foreground">Ano</Label>
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <UnifiedDropdown
              id="dashboard-year"
              options={yearOptions}
              value={field.value}
              onChange={(opt) => field.onChange(opt.value)}
              placeholder="Selecione o ano"
            />
          )}
        />
      </div>

      <div className="flex-1 min-w-64">
        <InputMultiSelectWrapper<DashboardFilterFormType, BadgeDropdownType>
          name="mockExamIds"
          control={control}
          label="Simulados"
          placeholder="Todos os simulados do ano"
          options={mockExamOptions}
          allowSearch
          showBadges
          noErrorMsg
        />
      </div>
    </div>
  );
}
