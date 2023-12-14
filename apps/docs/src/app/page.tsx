import Image from "next/image";
import { Code } from "@repo/ui/code";
import { Button } from "@repo/ui/button";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col min-h-screen bg-blue-600">
      <Button appName="Docs App!">Click me!</Button>
    </main>
  );
}
