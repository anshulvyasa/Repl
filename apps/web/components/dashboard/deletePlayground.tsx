"use client";

import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlaygroundService } from "@/services";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export const DeletePlayGroundComponent = ({
  playgroundId,
  playgroundTitle,
}: {
  playgroundId: string;
  playgroundTitle: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deletePlayGroundQuery = useMutation({
    mutationFn: deletePlaygroundService,
    onSuccess: (data) => {
      toast.success(data.message || "Operation done Successfully");
      queryClient.invalidateQueries({
        queryKey: ["playgrounds"],
      });
      setDeleteDialogOpen(false); // ✅ close dialog after success
    },
    onError: () => {
      toast.error("Error Deleting Playground");
    },
  });

  const handleDeletePlayground = () => {
    deletePlayGroundQuery.mutate(playgroundId);
  };

  return (
    <>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onSelect={(e) => {
          e.preventDefault();
          deletePlayGroundQuery.reset();
          setDeleteDialogOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Project
      </DropdownMenuItem>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playgroundTitle}"? This action
              cannot be undone. All files and data associated with this project
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePlayGroundQuery.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlayground}
              disabled={deletePlayGroundQuery.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlayGroundQuery.isPending
                ? "Deleting..."
                : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
