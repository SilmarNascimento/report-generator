import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { PageResponse } from '../interfaces'

interface UseIntersectionObserverPros<type> {
  isFetching: boolean,
  hasNextPage: boolean,
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<PageResponse<type>, unknown>, Error>>
}

export function useIntersectionObserver<type>({isFetching , hasNextPage, fetchNextPage }: UseIntersectionObserverPros<type>) {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastEntryRef = useCallback((node: Element | null) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      })

      if (node) observer.current.observe(node)
    },
    [isFetching, hasNextPage, fetchNextPage]
  )

  return { lastEntryRef }
}
