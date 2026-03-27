"use client";

import { useEffect } from "react";

export default function WebContainerAuth() {
  useEffect(() => {
    // This script tells WebContainer the connection was successful.
    // If it opened in a popup/new tab, it closes it.
    // If it redirected the main window, it sends you back.
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
      <p className="text-sm">Authenticating secure preview...</p>
    </div>
  );
}