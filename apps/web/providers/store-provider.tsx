"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/lib/redux/store";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    storeRef.current.subscribe(() => {
      const state = storeRef.current!.getState();
      localStorage.setItem(
        "fileops",
        JSON.stringify(state.fileOperations)
      );
    });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
