import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {

  return (
    <div className="flex flex-col items-center justify-center mt-12 pb-7">
      <div
        className="
          absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
          size-[500px] -z-10 rounded-full  bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-red-500/20  dark:from-rose-500/10 dark:via-pink-500/10 dark:to-red-500/10
           blur-[100px]"/>
      <div className="flex flex-col justify-center items-center mt-5">
        <Image src={"./hero.svg"} alt="Hero" width={500} height={500} />
        <h1 className=" z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight leading-[1.3] ">
          Vibe Code With with Intelligence
        </h1>
      </div>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 px-5 py-10 max-w-2xl">
        VibeCode Editor isn't just a tool; it's your intelligent coding partner. By merging advanced diagnostics with a seamless interface,
        we empower you to write cleaner code, squash bugs instantly, and optimize performance without breaking your flow.
      </p>
      <Link href={"/auth"}>
        <Button
          size={"lg"}
          className="mb-4 text-white bg-gradient-to-r from-rose-500 to-pink-500  hover:from-rose-600 hover:to-pink-600 dark:from-rose-500 dark:to-pink-500 
                      border-0 shadow-lg shadow-rose-500/30  dark:shadow-rose-500/20 transition-all duration-300  hover:scale-[1.02] hover:shadow-rose-500/50 ">
          Get Started
          <ArrowUpRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;