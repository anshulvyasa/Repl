import { auth } from "@/auth";
import AuthComponent from "@/components/auth/signin-component";
import { redirect } from "next/navigation";
import React from "react";

const AuthPage = async () => {
  const session = await auth();

  if (session?.user) return redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6">

      <div
        className="
    absolute inset-0 -z-20 h-full w-full 
    bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
    bg-[size:24px_24px] 
    [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]
  "
      />
      <div
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  size-[550px] -z-10 rounded-full  bg-gradient-to-tr from-rose-500/30
           via-pink-500/30 to-red-500/30  dark:from-rose-500/15 dark:via-pink-500/15 dark:to-red-500/15 blur-[120px] opacity-70 animate-pulse-slow"
      />
      <AuthComponent />
    </div>
  );
};

export default AuthPage;