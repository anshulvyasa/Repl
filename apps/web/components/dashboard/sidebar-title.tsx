import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  icon: LucideIcon;
  label: string;
  url: string;
}

export const SidebarTitle = ({ icon: Icon, label, url }: ButtonProps) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === url} tooltip="home">
            <Link href={url}>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
