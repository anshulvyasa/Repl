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
} from "lucide-react";

import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { name: "Accounts", href: "/settings/accounts", icon: User },
  { name: "Appearance", href: "/settings/appearence", icon: Palette },
  { name: "Editor", href: "/settings/editor", icon: Type },
  { name: "Language & Runtime", href: "/settings/languageAndRuntime", icon: Terminal },
  { name: "Keyboards", href: "/settings/keyBoard", icon: Keyboard },
  { name: "Execution", href: "/settings/execution", icon: Play },
  { name: "Files & Auto Save", href: "/settings/filesAndAutosave", icon: FileCode },
  
];

export default function SettingsSideBar() {

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        h-screen bg-[#1e1e2e] text-gray-300 flex flex-col border-r border-gray-800 
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-[70px]"} 
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

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isOpen ? item.name : ""} // Shows tooltip on hover when collapsed
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
              <item.icon size={20} className="min-w-[20px]" />

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