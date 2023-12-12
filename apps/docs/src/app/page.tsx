import Image from "next/image";
import { Code } from "@repo/ui/code";
import { Button } from "@repo/ui/button";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col min-h-screen bg-blue-600">
      <div className="">
        <p>
          examples/basic&nbsp;
          <Code className="">docs</Code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"
            rel="noopener noreferrer"
            target="_blank"
          >
            By{" "}
            <Image
              alt="Vercel Logo"
              className=""
              height={24}
              priority
              src="/vercel.svg"
              width={100}
            />
          </a>
        </div>
      </div>

      <Button appName="web" className="flex items-center">
        Click me!
      </Button>
    </main>
  );
}
