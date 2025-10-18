"use client";

import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Edit3 } from "lucide-react";
import React, { useState } from "react";
import { EditPlaygroundDataDialog } from "./edit-dialog";

export const EditPlaygrounds = ({
  playgroundId,
  title,
  description,
}: {
  playgroundId: string;
  title: string;
  description: string;
}) => {
  const [editPlaygroundDialogState, setEditPlaygroundDialogState] =
    useState<boolean>(false);
  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setEditPlaygroundDialogState(true);
        }}
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Edit Project
      </DropdownMenuItem>
      <EditPlaygroundDataDialog
        playgroundId={playgroundId}
        title={title}
        description={description}
        dialogState={editPlaygroundDialogState}
        setDialogState={setEditPlaygroundDialogState}
      />
    </>
  );
};
