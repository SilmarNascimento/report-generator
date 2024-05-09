import { UIEvent, useState } from "react"
import { DiagnosisTable } from "../../components/diagnosis/diagnosisTable"
import { NavigationBar } from "../../components/navigationBar"
import { DragDropFIleUploader } from "../../components/ui/dragDropFIle"
import { MockExamResponse } from "../../interfaces/MockExamResponse";
import { MockExam, PageResponse } from "../../interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";

export function Diagnosis() {
  const [selectedMockExam, setSelectedMockExam] = useState<MockExam | undefined>();
  const [studentResponses, setStudentResponses] = useState<MockExamResponse[]>([]);

  const [selectedItem, setSelectedItem] = useState<string>();

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const pageRef = useRef<number>(0);

  async function fetchData({ pageParam }) {
    const response = await fetch(`http://localhost:8080/subject/filter?pageNumber=${pageParam}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const requestData = await response.json();
    
    return requestData;
  }

  const { data, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<PageResponse<MockExam>>({
      queryKey: ['items'],
      queryFn: fetchData,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam: number) => {
        if (pageRef.current >= lastPage.pages - 1) {
          return null;
        }
        return lastPageParam + 1;
      },
    });

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const { currentTarget } = event;
    const target = currentTarget as HTMLDivElement;

    if (target.scrollHeight - target.scrollTop === target.clientHeight && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  const options = data?.pages.flatMap(page => page.data) ?? [];

  const handleChange = (newValue: string) => {
    setSelectedItem(newValue);
  };

  return (
    <>
      <NavigationBar />
      <main>
        <DragDropFIleUploader />
        {studentResponses
          ? <DiagnosisTable entity={studentResponses} />
          : <span className="text-violet-300">Faça o Upload do Arquivo de respostas</span>
        }
        {studentResponses
          && 
          <Pagination
            pages={mainQuestionPageResponse.pages}
            items={mainQuestionPageResponse.pageItems}
            page={page}
            totalItems={mainQuestionPageResponse.totalItems}
          />
        }
      </main>
    </>
  )
}