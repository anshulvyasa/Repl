"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import React, { useEffect } from "react";

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {

  const { templatePlaygroundSelector } = useTemplatePlayground();
  const { selectedPlayground } = useSelectedPlaygroundInfo();

  useEffect(() => {
      if(!templatePlaygroundSelector || !selectedPlayground ) return;

      

   }, [templatePlaygroundSelector, selectedPlayground])

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default PlaygroundLayout;
