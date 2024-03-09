import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Header } from "../components/header";
import { NavigationBar } from "../components/navigationBar";
import { Pagination } from "../components/pagination";
import { useSearchParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../components/ui/button";
import { FileDown, Filter, Loader2, Plus, Search, X, Pencil } from "lucide-react";
import { CreateSubjectForm } from "../components/ui/createSubjectForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Control, Input } from "../components/ui/input";
import { EditSubjectForm } from "../components/ui/editSubjectForm";

export interface SubjectPageResponse {
  pageItems: number
  totalItems: number
  pages: number
  data: Subject[]
}

export interface Subject {
  id: string
  name: string
}

export function Subjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter') ?? '';

  const [filter, setFilter] = useState(urlFilter);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const { data: subjectPageResponse, isLoading, isFetching } = useQuery<SubjectPageResponse>({
    queryKey: ['get-subjects', urlFilter, page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/subject?pageNumber=${page - 1}&pageSize=${pageSize}&title=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

  function handleFilter(event: FormEvent) {
    event.preventDefault()

    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <div>
        <Header />
        <NavigationBar />
      </div>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">Subjects</h1>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant='primary'>
                <Plus className="size-3" />
                Create new
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[520px] z-10 bg-zinc-950 border-l border-zinc-900">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold">
                    Create Subject
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500">
                    Subjects can be used to group objects with similar concepts.
                  </Dialog.Description>
                </div>

                <CreateSubjectForm />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {isFetching && <Loader2 className="size-4 animate-spin text-zinc-500" />}
        </div>

        <div className="flex items-center justify-between">
          <form onSubmit={handleFilter} className="flex items-center gap-2">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control 
                placeholder="Search tags..." 
                onChange={event => setFilter(event.target.value)}
                value={filter}
              />
            </Input>
            <Button type="submit">
              <Filter className="size-3" />
              Apply filters
            </Button>
          </form>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Id</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectPageResponse?.data.map((subject) => {
              return (
                <TableRow key={subject.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {subject.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" className="mx-0.5">
                      <X className="size-3" color="red"/>
                    </Button>
                
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <Button size="icon" className="mx-0.5">
                          <Pencil className="size-3" color="green"/>
                        </Button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
                        <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[520px] z-10 bg-zinc-950 border-l border-zinc-900">
                          <div className="space-y-3">
                            <Dialog.Title className="text-xl font-bold">
                              Edit Subject
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-zinc-500">
                              Edit the Subject's attribute.
                            </Dialog.Description>
                          </div>
                          <EditSubjectForm entity={subject} />
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {subjectPageResponse && <Pagination pages={subjectPageResponse.pages} items={subjectPageResponse.pageItems} page={page} totalItems={subjectPageResponse.totalItems}/>}
      </main>
    </>
  )
}