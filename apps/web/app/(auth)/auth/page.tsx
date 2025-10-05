import { auth } from "@/auth";
import AuthComponent from "@/components/auth/signin-component";

import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const AuthPage = async () => {
  const session = await auth();

  if (session) return redirect("/dashboard");

  return (
    <React.Fragment>
      <Image
        src={"./logo.svg"}
        height={300}
        width={300}
        alt="Logo Image"
        className="max-w-md h-60 w-60 mb-4 pt-4"
      />
      <AuthComponent />
    </React.Fragment>
  );
};

export default AuthPage;
