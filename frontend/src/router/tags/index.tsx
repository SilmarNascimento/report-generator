import { createFileRoute } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { z } from "zod";

import {
  Plus,
  Search,
  Filter,
  FileDown,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Control, Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import * as Dialog from "@radix-ui/react-dialog";
import { CreateSubjectForm } from "@/components/subject/createSubjectForm";

const searchSchema = z.object({
  filter: z.string().optional(),
  page: z.number().optional(),
});

export const Route = createFileRoute("/tags/")({
  validateSearch: searchSchema,
  component: TagsPage,
});

interface Tag {
  id: string;
  title: string;
  slug: string;
  amountOfVideos: number;
}

interface TagResponse {
  data: Tag[];
  pages: number;
  items: number;
}

function TagsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const filter = search.filter ?? "";
  const page = search.page ?? 1;

  const { data, isLoading, isFetching } = useQuery<TagResponse>({
    queryKey: ["tags", filter, page],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=10&title=${filter}`
      );
      return res.json();
    },
    placeholderData: keepPreviousData,
  });

  function applyFilter() {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        filter,
      }),
    });
  }

  if (isLoading) return null;

  return (
    <div className="py-10 space-y-8">
      <NavigationBar />

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="primary">
                <Plus className="size-3" />
                Create new
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed p-10 right-0 top-0 h-screen min-w-[320px] bg-zinc-950 border-l border-zinc-900">
                <CreateSubjectForm />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {isFetching && (
            <Loader2 className="size-4 animate-spin text-zinc-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                value={filter}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      filter: e.target.value,
                    }),
                  })
                }
              />
            </Input>

            <Button onClick={applyFilter}>
              <Filter className="size-3" />
              Apply filters
            </Button>
          </div>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{tag.title}</span>
                    <span className="text-xs text-zinc-500">{tag.slug}</span>
                  </div>
                </TableCell>

                <TableCell>{tag.amountOfVideos}</TableCell>

                <TableCell className="text-right">
                  <Button size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
