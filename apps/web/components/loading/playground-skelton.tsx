import { Card } from "../ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuSkeleton, SidebarProvider } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

const widths = ["60%", "70%", "80%", "65%", "75%"];

export const LoadingSkeleton = () => (


  <SidebarProvider>
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Skeleton Sidebar */}
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <Skeleton className="h-6 w-3/4" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Skeleton className="h-4 w-20" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 8 }).map((_, i) => (
                  // <SidebarMenuSkeleton key={i} showIcon />
                   <Skeleton key={i} className="h-4 w-[85%]" />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header Skeleton */}
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-48" />
        </header>

        {/* Tabs Skeleton */}
        <div className="flex gap-1 p-2 border-b bg-muted/30">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-t-md" />
          ))}
        </div>

        {/* Editor Skeleton */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <div className="p-4 space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-full"
                  style={{ width: widths[i % widths.length] }}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </SidebarProvider>
);