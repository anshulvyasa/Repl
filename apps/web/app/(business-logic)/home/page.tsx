"use client";

import { signOut } from "next-auth/react";

const HomePage = () => {
  const checkExpressIntegrtion = async () => {
    const res = await fetch("http://localhost:5000/", {
      method: "GET",
      credentials: "include", // ensures cookies are sent
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res);
  };

  return (
    <div>
      <h1>Hello this is Home Page if you are here you are authenticated</h1>
      <div className="cursor-pointer" onClick={checkExpressIntegrtion}>
        Click here to check the integration with the Express Backend
      </div>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  );
};

export default HomePage;
