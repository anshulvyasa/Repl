"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Palette,
  Type,
  Terminal,
  Keyboard,
  Play,
  FileCode,
  User,
  ChevronLeft,
  ChevronRight,
  MonitorDot,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const MENU_ITEMS = [
  { name: "Accounts", href: "/settings/accounts", icon: User },
  { name: "Appearance", href: "/settings/appearence", icon: Palette },
  { name: "Editor", href: "/settings/editor", icon: Type },
  { name: "Language & Runtime", href: "/settings/languageAndRuntime", icon: Terminal },
  { name: "Keyboards", href: "/settings/keyBoard", icon: Keyboard },
  { name: "Execution", href: "/settings/execution", icon: Play },
  { name: "Files & Auto Save", href: "/settings/filesAndAutosave", icon: FileCode },

];


type SettingsSideBarProps = {
  onClose?: () => void
}

export default function SettingsSideBar({ onClose }: SettingsSideBarProps) {

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile()

  const handleMenuClick = () => {
    if (!isMobile) return
    setIsOpen(false)
    onClose?.()
  }



  return (
    <aside
      className={`
    h-full bg-[#1e1e2e] text-gray-300 flex flex-col
    border-r border-gray-800
    transition-all duration-300 ease-in-out
    ${isMobile
          ? isOpen
            ? "w-full fixed inset-0 z-50"
            : "hidden"
          : isOpen
            ? "w-64"
            : "w-17.5"
        }
  `}
    >
      {/* Header */}
      <div className={`p-4 border-b border-gray-800 flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>

        {/* Only show title if open */}
        {isOpen && (
          <h1 className="font-bold text-xl text-white tracking-tight whitespace-nowrap overflow-hidden">
            Settings
          </h1>
        )}


        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 text-white bg-red-500"
          >
            <X />
          </button>
        )}

        {!isMobile && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-700"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        )}

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleMenuClick}
              title={!isOpen ? item.name : ""}
              className={`
    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
    ${isOpen ? "gap-3 justify-start" : "justify-center"} 
    ${isActive
                  ? "bg-gray-500 text-white shadow-md shadow-blue-500/20"
                  : "hover:bg-gray-400 hover:text-white"
                }
  `}
            >

              {/* Icon is always visible */}
              {!isMobile && <item.icon size={20} className="min-w-[20px]" />}

              {/* Text is only visible if open */}
              <span
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"}
                `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-800 flex ${isOpen ? "justify-start" : "justify-center"}`}>
        {isOpen ? (
          <span className="text-xs text-gray-500">v1.0.0</span>
        ) : (
          <span className="text-[10px] text-gray-500">v1</span>
        )}
      </div>
    </aside>
  );
} 