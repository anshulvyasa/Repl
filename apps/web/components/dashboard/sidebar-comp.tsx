"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SidebarTitle } from "./sidebar-title";
import {
  Code2,
  Compass,
  Database,
  FlameIcon,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  LucideIcon,
  Plus,
  Settings,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface PlaygroundData {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Lightbulb,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2,
};

const SidebarComponent = ({
  initialDataPlayground,
}: {
  initialDataPlayground: PlaygroundData[];
}) => {
  const pathname = usePathname();
  const [starredPlayground, setStarredPlayground] = useState(
    initialDataPlayground.filter((playground) => playground.starred)
  );
  const [recentPlayGround, setRecentPlayGround] = useState(
    initialDataPlayground
  );

  useEffect(() => {
    setRecentPlayGround(initialDataPlayground);

    const filteredStarredPlayGround = initialDataPlayground.filter(
      (playground) => playground.starred
    );

    setStarredPlayground(filteredStarredPlayGround);
  }, [initialDataPlayground]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-1 py-2 px-1">
          <Image src={"./logo.svg"} alt="R" height={40} width={40} />
          <span className="font-bold text-gray-700 dark:text-white text-xl">Repl</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="flex flex-col">
          <SidebarTitle label="Home" icon={Home} url="/" />
          <SidebarTitle
            label="Dashboard"
            icon={LayoutDashboard}
            url="/dashboard"
          />

          <SidebarGroup>
            <SidebarGroupLabel>Starred</SidebarGroupLabel>
            <SidebarGroupAction title="Add starred playground">
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu className="overflow-y-auto max-h-[30vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {starredPlayground.length === 0 ? (
                  <div className=" text-muted-foreground py-2 px-2 w-full">
                    No Starred Playground
                  </div>
                ) : (
                  starredPlayground.map((playground) => {
                    const IconComponent =
                      lucideIconMap[playground.icon] || Code2;
                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/playground/${playground.id}`}
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <History className="h-4 w-4 mr-2" />
              Recent
            </SidebarGroupLabel>
            <SidebarGroupAction title="Create new playground">
              <FolderPlus className="h-4 w-4" />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu className="overflow-y-auto max-h-[30vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {recentPlayGround.length === 0
                  ? null
                  : recentPlayGround.map((playground) => {
                    const IconComponent =
                      lucideIconMap[playground.icon] || Code2;
                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            pathname === `/playground/${playground.id}`
                          }
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="View all">
                    <Link href="/playgrounds">
                      <span className="text-sm text-muted-foreground">
                        View all playgrounds
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign-out"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>

          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings/accounts">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarComponent;
