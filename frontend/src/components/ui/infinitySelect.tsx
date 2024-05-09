import { UIEvent, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as SelectPrimitive from '@radix-ui/react-select';
import { MockExam, PageResponse } from '../../interfaces';
import { useSearchParams } from 'react-router-dom';

const { Select } = SelectPrimitive;

// interface InfinitySelectProps {
//   fetchData: () => QueryFunction<PageResponse<MockExam>, { pageParam: number }>
//   handleScroll: (event: UIEvent<HTMLDivElement>) => void
// }

export function InfiniteSelect(/*{ fetchData }: InfinitySelectProps*/) {
  const [selectedItem, setSelectedItem] = useState<string>();

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const pageRef = useRef<number>(0);

  async function fetchData() {
    const response = await fetch(`http://localhost:8080/subject/filter?pageNumber=${page - 1}&pageSize=${pageSize}`,
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
      initialPageParam: pageRef.current,
      getNextPageParam: (lastPage) => pageRef.current < lastPage.pages - 1 ? pageRef.current + 1 : null,
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
    <div className="relative">
      <Select
        value={selectedItem}  //colocar o código
        onValueChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
        onScroll={handleScroll}
        disabled={isFetchingNextPage}
      >
        {options.map(option => (
          <SelectPrimitive.Option key={option.id} value={option.id} className="py-2 px-4 cursor-pointer">
            {option.label}
          </SelectPrimitive.Option>
        ))}
        {isFetchingNextPage && (
          <SelectPrimitive.Option disabled>Loading...</SelectPrimitive.Option>
        )}
      </Select>
    </div>
  );
}
