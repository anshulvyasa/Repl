"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

const ResendAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      setError("Please enter an email address");
      setLoading(false);
      return;
    }

    try {
      // Client component mein sirf email string pass karo, FormData nahi!
      await signIn("resend", { email });
    } catch (err) {
      setError("Failed to send email. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 items-center max-w-sm mx-auto"
    >
      <Input
        type="email"
        name="email"
        placeholder="Enter Your Email"
        required
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        size={"lg"}
        className="mb-4 w-full text-white bg-gradient-to-r from-rose-500 to-pink-500  hover:from-rose-600 hover:to-pink-600 dark:from-rose-500 dark:to-pink-500 
                      border-0 shadow-sm shadow-rose-500/30  dark:shadow-rose-500/20 transition-all duration-300  hover:scale-[1.02] hover:shadow-rose-500/50 "
      >
        {loading ? "Sending..." : "Send Email"}
      </Button>
    </form>
  );
};

export default ResendAuth;
