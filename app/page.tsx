export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
          AI
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Apex Gabby
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Continue in Google AI Studio
          </h1>
          <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Open the project in the correct Google workspace instead of following a missing preview link.
          </p>
        </div>
        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Open Google AI Studio
          <span aria-hidden="true" className="ml-2">↗</span>
        </a>
      </section>
    </main>
  )
}

