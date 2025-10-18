import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlaygroundDataService } from "@/services";
import { editPlaygroundSchema } from "@repo/zod/playground";
import { toast } from "sonner";

interface EditProjectData {
  title: string;
  description: string;
}

export const EditPlaygroundDataDialog = ({
  playgroundId,
  title,
  description,
  dialogState,
  setDialogState,
}: {
  playgroundId: string;
  title: string;
  description: string;
  dialogState: boolean;
  setDialogState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log("Edit Data is ", playgroundId, "  ", title, "  ", description);

  const [editData, setEditData] = useState<EditProjectData>({
    title,
    description,
  });
  const queryClient = useQueryClient();

  console.log("Edit Data is ", playgroundId, "  ", title, "  ", description);
  console.log("State Data is ", editData);

  const editPlaygroundQuery = useMutation({
    mutationFn: () => updatePlaygroundDataService(playgroundId, editData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playgrounds"] });
      setDialogState(false);
    },
  });

  const handleUpdateProject = () => {
    const parsedEditSchema = editPlaygroundSchema.safeParse(editData);

    if (parsedEditSchema.error) {
      toast.error("Feilds are not Valid");
    }

    editPlaygroundQuery.mutate();
  };

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter project title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter project description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogState(false)}
            // disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdateProject}
            // disabled={isLoading || !editData.title.trim()}
          >
            {/* {isLoading ? "Saving..." : "Save Changes"} */}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
