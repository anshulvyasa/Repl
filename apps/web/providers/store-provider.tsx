"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "../lib/redux/store";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  if (storeRef.current) {
    
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
