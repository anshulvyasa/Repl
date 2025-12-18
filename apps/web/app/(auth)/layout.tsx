import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen w-full dark:bg-black/60 text-black dark:text-white overflow-hidden">
      {children}
    </main>
  );
};

export default AuthLayout;