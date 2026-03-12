"use client"

import { useState } from "react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { ChevronRight, X } from "lucide-react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen ">
      {isMobile && !mobileSidebarOpen && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 rounded-lg bg-[#1e1e2e] p-2 text-white shadow-lg"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <main
        className={`
          flex-1 p-4 transition-all
          ${isMobile && mobileSidebarOpen ? "hidden" : "block"}
        `}
      >
       
        <div className="flex justify-end">
          <Link
            href="/dashboard"
            className="p-2 rounded-full transition hover:bg-red-500"
          >
            <X className="text-gray-400 hover:text-white" />
          </Link>
        </div>

        
        <div className="mt-4">
          {children}
        </div>
      </main>
    </div>
  )
}