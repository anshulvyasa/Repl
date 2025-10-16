"use client";

import SidebarComponent from "@/components/dashboard/sidebar-comp";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlayGroundService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

type PlaygroundItem = {
  id: string;
  title: string;
  template: string;
  starmark?: { isMarked: boolean }[]; // as returned by your prisma include
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const query = useQuery({
    queryKey: ["playgrounds"],
    queryFn: getAllPlayGroundService,
  });

  const [formattedPlaygroundData, setFormattedPlaygroundData] = useState<
    { id: string; name: string; starred: boolean; icon: string }[]
  >([]);

  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXT: "Lightbulb", // <- use NEXT not NEXTJS if your enum is NEXT
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  useEffect(() => {
    if (!query.data?.data?.playgrounds) return;

    const formattedPlayground =
      (query.data.data.playgrounds as PlaygroundItem[]).map((item) => ({
        id: item.id,
        name: item.title,
        starred: item.starmark?.[0]?.isMarked ?? false,
        icon: technologyIconMap[item.template] || "Code2",
      })) || [];

    setFormattedPlaygroundData(formattedPlayground);
  }, [query.data]);

  return (
    <SidebarProvider className="flex min-h-screen w-full overflow-x-hidden">
      <SidebarComponent initialDataPlayground={formattedPlaygroundData} />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
