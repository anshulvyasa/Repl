"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import React from "react";
import ResendAuth from "./resend";
import { Button } from "../ui/button";
import Image from "next/image";

const AuthComponent = () => {
  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  return (
    <Card className="w-full max-w-md mx-auto border-rose-100 dark:border-rose-900/20 bg-white/70 dark:bg-black/50 backdrop-blur-xl shadow-2xl shadow-rose-500/10">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="
            text-3xl font-extrabold 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-rose-500 via-red-500 to-pink-500
            tracking-tight
          ">
          <div className="flex items-center justify-center">
            <Image
              src={"./logo.svg"}
              height={85}
              width={85}
              alt="Repl Logo"
              className="drop-shadow-md"
            /></div>
          Welcome to Repl
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Sign in to your intelligent coding partner
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ResendAuth />

        <div className="relative -mt-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-200"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Google
          </Button>

          <Button
            variant="outline"
            className="h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-200"
            onClick={handleGithubLogin}
          >
            <FaGithub className="mr-2 h-5 w-5" />
            GitHub
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center pb-6">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-8">
          By signing in, you agree to our{" "}
          <span className="text-rose-500 hover:text-rose-600 cursor-pointer font-semibold transition-colors">
            Terms
          </span>
          {" "}and{" "}
          <span className="text-rose-500 hover:text-rose-600 cursor-pointer font-semibold transition-colors">
            Privacy Policy
          </span>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthComponent;