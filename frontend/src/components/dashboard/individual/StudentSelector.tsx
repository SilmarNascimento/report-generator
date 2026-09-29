import { useState } from "react";
import { useGetStudents } from "@/hooks/CRUD/student/useGetStudents";
import useDebounceValue from "@/hooks/useDebounceValue";
import UnifiedDropdown from "@/components/Features/UnifiedDropdown";
import { Label } from "@/components/ui/shadcn/Label";
import { DropdownType } from "@/interfaces/general";

type StudentSelectorProps = {
  selectedStudentId: string | null;
  onStudentChange: (studentId: string | null, studentName: string) => void;
};

export function StudentSelector({ selectedStudentId, onStudentChange }: StudentSelectorProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounceValue(query, 400);

  const { data: studentPage } = useGetStudents(1, 50, debouncedQuery);

  const studentOptions: DropdownType[] =
    studentPage?.data.map((s) => ({ label: s.name, value: s.id })) ?? [];

  return (
    <div className="flex flex-col gap-1.5 min-w-72 max-w-sm">
      <Label className="text-sm font-medium text-foreground">Aluno</Label>
      <UnifiedDropdown
        id="student-selector"
        options={studentOptions}
        value={selectedStudentId ?? ""}
        onChange={(opt) => onStudentChange(opt.value, opt.label)}
        placeholder="Busque por nome do aluno"
        allowSearch
        queryValue={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
