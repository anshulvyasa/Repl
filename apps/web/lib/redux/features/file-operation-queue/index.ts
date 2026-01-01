import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FileOperationSchemaType,
  FileOperationSchemaQueueType,
  FileOperationSchemaQueue,
} from "@repo/zod/files-operation-queue";
import { AppThunk } from "../../store";
import axiosInstance from "@/axiosinstance";
import { addPlaygroundTemplateFiles } from "../playground-file-data";

const defaultState: FileOperationSchemaQueueType = {
  items: [],
  head: 0,
};

const calcInitialState = (): FileOperationSchemaQueueType => {
  try {
    const stored = localStorage.getItem("fileops");
    if (!stored) return defaultState;

    const parsed = FileOperationSchemaQueue.safeParse(JSON.parse(stored));
    if (!parsed.success) return defaultState;

    return parsed.data;
  } catch {
    return defaultState;
  }
};

const initialState = calcInitialState();

//slice

const slice = createSlice({
  name: "fileOperationQueue",
  initialState,
  reducers: {
    addOperationToOpsQueue(state, action) {
      state.items.push(action.payload);
      localStorage.setItem("fileops", JSON.stringify(state));
    },

    clearOperationQueue(state) {
      state.items = [];
      state.head = 0;
      localStorage.removeItem("fileops");
    },

    setQueueHead(state, action) {
      state.head = action.payload;
      localStorage.setItem("fileops", JSON.stringify(state));
    },
  },
});

export default slice.reducer;
export const { addOperationToOpsQueue, clearOperationQueue, setQueueHead } =
  slice.actions;

//sync file operations from client to server
export const fileQueueThunk = (): AppThunk => async (dispatch, getState) => {
  const { fileOperations, selectedPlaygroundInfo } = getState();

  if (!selectedPlaygroundInfo?.id) return;
  if (
    fileOperations.items.length === 0 ||
    fileOperations.head >= fileOperations.items.length
  ) {
    return;
  }

  const res = await axiosInstance.post(
    `/app/v1/files/sync/${selectedPlaygroundInfo.id}`,
    {
      items: fileOperations.items,
      head: fileOperations.head,
    }
  );

  if (!res.data?.success) return;

  dispatch(clearOperationQueue());

  const refreshed = await axiosInstance.get(
    `/app/v1/files/get/${selectedPlaygroundInfo.id}`
  );

  dispatch(addPlaygroundTemplateFiles(refreshed.data.files.content));
};
