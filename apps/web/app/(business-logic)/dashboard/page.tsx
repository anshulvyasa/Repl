"use client";

import { AddNewButton } from "@/components/dashboard/add-new-button";
import { AddRepo } from "@/components/dashboard/add-repo";
import { EmptyState } from "@/components/dashboard/empty-state";

const DashboardPage = () => {
  const playgrounds = [];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="flex flex-col justify-center items-center mt-10 w-full">
        {playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <div>Baad me karte hai ji</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
