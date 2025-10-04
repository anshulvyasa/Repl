import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen bg-zinc-800 flex justify-center items-center flex-col overflow-auto">
      {children}
    </main>
  );
};

export default AuthLayout;
