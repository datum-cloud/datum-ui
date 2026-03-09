import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">datum-ui</h1>
      <p className="text-fd-muted-foreground text-lg">
        Datum Cloud Design System
      </p>
      <Link
        href="/docs"
        className="rounded-md bg-fd-primary px-6 py-2 text-fd-primary-foreground hover:opacity-90"
      >
        View Documentation
      </Link>
    </main>
  )
}
