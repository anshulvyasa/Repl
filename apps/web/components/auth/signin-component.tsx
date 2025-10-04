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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import ResendAuth from "./resend";

const AuthComponent = () => {
  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  const handleMagicEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) return;

    // Provider id = "resend"
    await signIn("resend", {
      email,
    });
  };

  return (
    <Card className="max-w-md mx-3 shadow-lg shadow-gray-600 ">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Repl</CardTitle>
        <CardDescription className="font-[400]">
          Choose Your Preferred Sign-in Methord
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResendAuth/>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="flex items-center space-x-2 bg-zinc-200 px-7 py-2 rounded-2xl cursor-pointer"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="hidden h-6 w-6 xs1:block" />{" "}
              <span className="text-[15px] sm:text-[17px] font-[500] text-zinc-700">
                Google
              </span>
            </div>
            <div
              className="flex items-center space-x-2 bg-zinc-200 px-7 py-2 rounded-2xl cursor-pointer"
              onClick={handleGithubLogin}
            >
              <FaGithub className="hidden h-6 w-6 xs1:block" />{" "}
              <span className="text-[15px] sm:text-[17px] font-[500] text-zinc-700">
                Github
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <h3 className="text-[9px] text-center">
          by Signing You Agree With Our{" "}
          <span className="text-gray-500 font-bold underline ">
            Terms & Contidions
          </span>
        </h3>
      </CardFooter>
    </Card>
  );
};

export default AuthComponent;
