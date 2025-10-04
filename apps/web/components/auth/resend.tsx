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
        className="px-5 py-2 w-full -mt-1 mb-4 text-[14px] sm:text-[16px] font-[500] cursor-pointer"
      >
        {loading ? "Sending..." : "Send Email"}
      </Button>
    </form>
  );
};

export default ResendAuth;
