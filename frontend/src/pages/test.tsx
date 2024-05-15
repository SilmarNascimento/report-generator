//import { UIEvent } from 'react';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { PageResponse, Subject } from '../interfaces';
import { useState } from 'react';
import { InfiniteSelect } from '../components/ui/select/infiniteSelect';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

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

export function Test() {
  const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({ label: '', value: '' });
  const [subjectOptionsList, setSubjectOptionsList] = useState<SelectOptionProps[]>([]);


  const handleSelect = (option: SelectOptionProps) => {
    setSelectedOption(option)
  }

  async function fetchData(context: QueryFunctionContext) {
    const { pageParam } = context;
    const pageNumber = typeof pageParam === 'number' ? pageParam : 0;

    const response = await fetch(`http://localhost:8080/subject/filter?pageNumber=${pageNumber}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          subjectsId: []
        })
      }
    )
    const requestData: PageResponse<Subject> = await response.json();
    const options = requestData?.data.map((subject) => {
      const  { id, name } = subject;
      return {
        label: name,
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
  } = useInfiniteQuery<PageResponse<Subject>>({
    queryKey: ['items'],
    queryFn: fetchData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>  lastPage.currentPage < (lastPage.pages - 1) ? lastPage.currentPage + 1 : undefined 
  });

  const { lastEntryRef } = useIntersectionObserver<Subject>({isFetching, hasNextPage, fetchNextPage});


  function handleClick() {
    
    if (!isFetchingNextPage) {
      console.log("chamei fetch next");
          fetchNextPage();
        }
  }

  return (
    <>
      <button type='button' onClick={handleClick}>Load Next</button>

      <div className='block w-52'>
        <span className='block mb-2 text-sm'>Selecione um Assunto</span>
        <InfiniteSelect
          options={subjectOptionsList}
          selected={selectedOption}
          placeholder='Selecione um Assunto'
          handleSelect={handleSelect}
          isFetchingOptions={isFetchingNextPage}
          lastOptionRef={lastEntryRef}
        />
      </div>
    </>
  );
}

/* 

import React from 'react';
import { render } from 'react-dom';
import Select from 'react-select';
import qs from 'query-string';
import urlJoin from 'url-join';
import './style.css';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { toPairs, range } from 'ramda';
import { snakeCase } from 'lodash';
import faker from 'faker';

const url = 'https://api.github.com/users/mateja176/repos'

const pageSize = 10
const maxPage = 10;
const rowCount = pageSize * maxPage;

const rowHeight = 30
const maxListheight = pageSize * rowHeight

const users = range(0, rowCount).map(() => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
}))

const fetch = (url: string) => {
  const { query: { page } } = qs.parseUrl(url);
  const pageNumber = Number(page)
  const start = pageNumber * pageSize
  return new Promise<{ json: () => Promise<Array<{ id: string, name: string }>> }>(resolve => setTimeout(() => resolve({
    json: () => Promise.resolve(users.slice(start, start + pageSize))
  }), 2000))
}
const App: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [collection, setCollection] = React.useState([]);

  const fetchReposByPage = (newPage: number) => {
    const query = qs.stringify({ per_page: pageSize, page: newPage })
    const reposByPage = urlJoin(url, '?' + query)

    return fetch(reposByPage)
      .then(res => res.json())
      .then((data) => {
        console.log(data)

        setLoading(false);

        setCollection(collection.concat(data))
      })
  }
  React.useEffect(() => {
    setLoading(true);

    fetchReposByPage(1);
  }, [])

  const options = collection.map(({ id, name }) => {
    return { value: id, label: name }
  })


  const loadMoreRows = ({ startIndex }) => {
    const newPage = Math.floor(startIndex / pageSize + 1);

    console.log(newPage)

    return fetchReposByPage(newPage)
  }

  const currentListHeight = pageSize * rowHeight
  const listHeight = collection.length > currentListHeight ? maxListheight : currentListHeight

  const MenuList = ({ children, ...menuListProps }) => {
    console.log(menuListProps)
    const childrenArray = React.Children.toArray(children)

    const rowRenderer = ({ index, isScrolling, isVisible, style, ...rest }) => {
      const child = childrenArray[index]
      return (
        <div
          style={{
            borderBottom: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            ...style,
          }}
          {...rest}
        >
          {child ? child : `${index}. Loading...`}
        </div>
      )
    }

    return (
      <InfiniteLoader
        isRowLoaded={({ index }) => !!collection[index]}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
        threshhold={5}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                height={listHeight}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={rowCount}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  return (
    <div>
      <Select
        defaultMenuIsOpen={true}
        isLoading={loading}
        options={options}
        components={{
          MenuList,
        }}
      />
    </div>
  )
}

render(<App />, document.getElementById('root'));


*/