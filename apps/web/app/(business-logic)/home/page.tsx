"use client";

import { signOut } from "next-auth/react";

const HomePage = () => {
 
  return (
    <div>
      <h1>Hello this is Home Page if you are here you are authenticated</h1>
      <div className="cursor-pointer" >
        Click here to check the integration with the Express Backend
      </div>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  );
};

export default HomePage;
