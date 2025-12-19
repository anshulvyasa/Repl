"use client";

import SidebarComponent from "@/components/dashboard/sidebar-comp";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PlayGround } from "@/lib/redux/features/projects";
import { useProject } from "@/lib/redux/selectoranddispatcher/useProjects";
import { getAllPlayGroundService } from "@/services";
import { playGroundSchemaForClient } from "@repo/zod/playground";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";

type PlaygroundItem = {
  id: string;
  title: string;
  template: string;
  starmark?: { isMarked: boolean }[]; 
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { addPlaygrounds } = useProject();

  const query = useQuery({
    queryKey: ["playgrounds"],
    queryFn: getAllPlayGroundService,
  });

  const [formattedPlaygroundData, setFormattedPlaygroundData] = useState<
    { id: string; name: string; starred: boolean; icon: string }[]
  >([]);

  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXT: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const playgrounds: PlayGround[] = useMemo(() => {
    if (!query.data) return [];

    const parsesQuery = playGroundSchemaForClient.safeParse(
      query.data.data.playgrounds
    );

    if (parsesQuery.error) {
      console.error("The Error is ", parsesQuery.error.message);
      return [];
    }

    const currentPlaygrounds = parsesQuery.data.map((item) => {
      const playground: PlayGround = {
        id: item.id,
        title: item.title,
        description: item.description,
        template: item.template,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        userId: item.user.id,
        user: {
          id: item.user.id,
          name: item.user.name || "anonymous",
          email: item.user.email,
          image: item.user.image,
          role: item.user.role,
          createdAt: item.user.createdAt,
          updatedAt: item.user.updatedAt,
        },
        starmark: item.starmark,
      };

      return playground;
    });

    return currentPlaygrounds;
  }, [query.data]);

  useEffect(() => {
    addPlaygrounds(playgrounds);
  }, [playgrounds]);

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
