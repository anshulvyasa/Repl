"use client";

import { signOut } from "next-auth/react";

const HomePage = () => {
  return (
    <div>
      <h1>Hello this is Home Page if you are here you are authenticated</h1>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  );
};

export default HomePage;
