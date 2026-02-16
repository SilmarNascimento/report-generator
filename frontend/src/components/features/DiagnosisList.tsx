import { useState } from "react";
import { FileDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/shadcn/button";
import { Checkbox } from "../ui/shadcn/checkbox";
import { MockExamResponseType, YearlyResponse } from "@/interfaces/Student";
import { cn } from "@/lib/utils";

type DiagnosisListProps = { responses: YearlyResponse[] };

export function DiagnosisList({ responses }: DiagnosisListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (reports: MockExamResponseType[]) => {
    const reportIds = reports.map((r) => r.id);
    const allSelected = reportIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !reportIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...reportIds])));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Diagnósticos dos Alunos</h2>
        <Button
          disabled={selectedIds.length === 0}
          onClick={() => console.log("Baixando:", selectedIds)}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Baixar Selecionados ({selectedIds.length})
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-3">
        {responses.map((yearly) => (
          <AccordionItem
            key={yearly.year}
            value={`year-${yearly.year}`}
            className="border rounded-lg bg-zinc-50/50 px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-zinc-700">
                  Ano Letivo: {yearly.year}
                </span>
                <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded-full">
                  {yearly.classGroupResponsesList.length} Turmas
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-4">
              <Accordion type="multiple" className="space-y-2">
                {yearly.classGroupResponsesList.map((group) => {
                  const isAllGroupSelected = group.responses.every((r) =>
                    selectedIds.includes(r.id),
                  );
                  const isSomeGroupSelected =
                    group.responses.some((r) => selectedIds.includes(r.id)) &&
                    !isAllGroupSelected;

                  return (
                    <AccordionItem
                      key={group.classGroupName}
                      value={`${yearly.year}-${group.classGroupName}`}
                      className="border rounded-md bg-white shadow-sm"
                    >
                      <div className="flex items-center px-4 hover:bg-zinc-50 transition-colors">
                        <Checkbox
                          checked={
                            isAllGroupSelected ||
                            (isSomeGroupSelected ? "indeterminate" : false)
                          }
                          className={cn(isSomeGroupSelected && "opacity-50")}
                          onCheckedChange={() =>
                            toggleSelectAll(group.responses)
                          }
                        />

                        <AccordionTrigger className="flex-1 py-3 pl-3 hover:no-underline">
                          <span className="font-semibold text-zinc-600">
                            Turma: {group.classGroupName}
                          </span>
                        </AccordionTrigger>
                      </div>

                      <AccordionContent className="pt-0">
                        <Table>
                          <TableHeader className="bg-zinc-50/80">
                            <TableRow>
                              <TableHead className="w-12 text-center"></TableHead>
                              <TableHead>Simulado</TableHead>
                              <TableHead className="text-center">
                                Número
                              </TableHead>
                              <TableHead className="text-center">
                                Acertos
                              </TableHead>
                              <TableHead className="text-center">
                                IPM Score
                              </TableHead>
                              <TableHead className="text-right"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.responses.map((report) => (
                              <TableRow
                                key={report.id}
                                className="hover:bg-zinc-50/50"
                              >
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={selectedIds.includes(report.id)}
                                    onCheckedChange={() =>
                                      toggleSelect(report.id)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-medium text-zinc-700">
                                  {report.mockExamName}
                                </TableCell>
                                <TableCell className="text-center text-zinc-500">
                                  {report.mockExamNumber}
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="inline-flex items-center justify-center bg-zinc-100 rounded-md px-2 py-1 min-w-[30px]">
                                    {report.correctAnswers}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="font-bold text-teal-600">
                                    {report.ipmScore}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button className="text-blue-600 h-8 px-2">
                                    <FileDown className="size-4 mr-1" /> PDF
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
