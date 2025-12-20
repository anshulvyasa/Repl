"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "../lib/redux/store";
import { fileQueueThunk } from "@/lib/redux/features/file-operation-queue";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.subscribe(() => {
      const state = storeRef.current!.getState();
      const queue = state.fileOperations;

      if (queue.head !== -1 && queue.items.length > 0) {
        storeRef.current!.dispatch(fileQueueThunk());
      }
    })

    storeRef.current.dispatch(fileQueueThunk());
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
