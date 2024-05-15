import { useState } from "react"
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable"
import { NavigationBar } from "../../components/navigationBar"
import { DragDropFIleUploader } from "../../components/ui/dragDropFIle"
import { MockExamResponse } from "../../interfaces/MockExamResponse";
import { MockExam, PageResponse } from "../../interfaces";
import { QueryKey, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { InfiniteSelect } from "../../components/ui/select/infiniteSelect";
import { successAlert, warningAlert } from "../../utils/toastAlerts";

interface QueryFunctionContext {
  queryKey: QueryKey;
  pageParam?: unknown;
  signal: AbortSignal;
  meta?: Record<string, unknown>;
}

type SelectOptionProps = {
  label: string
  value: string
}

export function Diagnosis() {
  const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({ label: '', value: '' });
  const [subjectOptionsList, setSubjectOptionsList] = useState<SelectOptionProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [studentResponseList, setStudentResponseList] = useState<MockExamResponse[]>([]);

  async function fetchMockExamList(context: QueryFunctionContext) {
    const { pageParam } = context;
    const pageNumber = typeof pageParam === 'number' ? pageParam : 0;

    const response = await fetch(`http://localhost:8080/mock-exam?pageNumber=${pageNumber}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const requestData: PageResponse<MockExam> = await response.json();
    const options = requestData?.data.map((mockExam) => {
      const  { id, releasedYear, number, className } = mockExam;
      const code = `${releasedYear}:S${number} - ${className[0]}`;
      return {
        label: code,
        value: id
      };
    }) ?? [];
    setSubjectOptionsList((prev) => [...prev, ...options])
    
    return requestData
  }

  const {
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuery<PageResponse<MockExam>>({
    queryKey: ['items'],
    queryFn: fetchMockExamList,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>  lastPage.currentPage < (lastPage.pages - 1) ? lastPage.currentPage + 1 : undefined 
  });

  const { lastEntryRef } = useIntersectionObserver<MockExam>({isFetching, hasNextPage, fetchNextPage});

  
  const generateStudentsResponse = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('studentsMockExamsAnswers', file);
     
      // const json = JSON.stringify(createMainQuestion);
      // const blob = new Blob([json], {
      //   type: 'application/json'
      // });

      // formData.append("mainQuestionInputDto", blob);
      
      const response = await fetch(`http://localhost:8080/mock-exam/${selectedOption.value}/responses`,
        {
          method: 'POST',
          body: formData
        })

      if (response.status === 200) {
        const responseList: MockExamResponse[] = await response.json();
        setStudentResponseList(responseList);
        successAlert('Questão principal salva com sucesso!');
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    }
  })


  const handleSelect = (option: SelectOptionProps) => {
    setSelectedOption(option)

  }

  async function handleUploadFile(files: File[]) {
    const file = files[0];
    await generateStudentsResponse.mutateAsync(file);
  }

  return (
    <>
      <NavigationBar />
      <main>
        <div className='block w-52'>
          <span className='block mb-2 text-sm'>
            Selecione um Simulado
          </span>
          <InfiniteSelect
            options={subjectOptionsList}
            selected={selectedOption}
            placeholder='Selecione um Simulado'
            handleSelect={handleSelect}
            isFetchingOptions={isFetchingNextPage}
            lastOptionRef={lastEntryRef}
          />
        </div>
        <div>
          <DragDropFIleUploader
            files={files}
            setFiles={setFiles}
            handleUploadFile={handleUploadFile}
            dependency={!!selectedOption.value}
          />
        </div>
        <section>
          { !!studentResponseList.length && 
            <DiagnosisTable
              entity={studentResponseList}
            />
          }
        </section>
      </main>
    </>
  )
}