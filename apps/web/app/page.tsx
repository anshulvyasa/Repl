import { Button } from "@/components/ui/button";
import { prisma } from "@repo/db";

export default function Home() {
  return (
    <div className="text-4xl text-red-400">
      <h1>ShadCn Button</h1>
      <Button variant="ghost">Click me </Button>
    </div>
  );
}
