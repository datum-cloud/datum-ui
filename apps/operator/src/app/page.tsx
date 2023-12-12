import { Button } from "@repo/ui/button";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col min-h-screen items-center space-between p-24 bg-blue-600">
      <Button appName="Operator Portal">Click Me!</Button>
    </main>
  );
}
