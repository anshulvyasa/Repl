import React from "react";
import Link from "next/link";
import { X } from "lucide-react";

import SettingsSideBar from "./settingsSideBar"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
     <div className="flex">
      <aside>
         <SettingsSideBar /> 
      </aside>
      <main className="flex-1 p-4">
        <div className="flex justify-end">
          <Link href="/dashboard" className="p-2 rounded-full transition-colors hover:bg-red-500 hover:scale-105"> 
            <X size={24} className="text-gray-400 hover:text-white"/>
          </Link>
        </div>
        <div className="ml-auto mt-auto mr-5">
          {children} 
        </div>
        
      </main>
    </div>
    )

}