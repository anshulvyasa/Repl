"use client";

import { useProject } from "@/lib/redux/selectoranddispatcher/useProjects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

export const DashBoardTable = () => {
  const { playgrounds } = useProject();

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {playgrounds.map((playground) => (
            <TableRow key={playground.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <Link
                    href={`/playground/${playground.id}`}
                    className="hover:underline"
                  >
                    <span className="font-semibold">{playground.title}</span>
                  </Link>
                  <span className="text-sm text-gray-500 line-clamp-1">
                    {playground.description}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-[#E93F3F15] text-[#E93F3F] border-[#E93F3F]"
                >
                  {playground.template}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(playground.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={playground.user.image || "/placeholder.svg"}
                      alt={playground.user.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm">{playground.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/playground/${playground.id}`}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Open Project
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
