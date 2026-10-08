import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseLayout } from "@/components/course-shell";

export const Route = createFileRoute("/lectures")({
  head: () => ({ meta: [
    { title: "Lectures | UW CSE 490 A2 Vibe Coding" },
    { name: "description", content: "Lecture materials for UW CSE 490 A2 Vibe Coding, beginning with L01: Intro + Prompt to App." },
    { property: "og:title", content: "Lectures | UW CSE 490 A2 Vibe Coding" },
    { property: "og:description", content: "Browse Vibe Coding lectures and materials, beginning with L01: Intro + Prompt to App." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Lectures,
});

function Lectures() {
  return (
    <CourseLayout>
      <main className="min-h-[55vh]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
            <Link to="/" className="hover:underline">Vibe Coding</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Lectures</span>
          </nav>
          <p className="mt-6 inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
            Course material
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter sm:text-5xl">
            Lectures
          </h1>

          <article className="mt-10 border-2 border-ink bg-card p-6 shadow-hard md:p-8">
            <div className="grid gap-6 md:grid-cols-[6rem_1fr]">
              <span className="font-display text-5xl font-bold tracking-tighter text-primary">L01</span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                  Intro + Prompt to App
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Introduce the class, build your first end-to-end app, and
                  examine how to steer and verify AI-assisted code.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://docs.google.com/presentation/d/1JZoVNiDwyTnzxVSkouKSFZrMMMMPnqpKgVpodDX83_k/edit"
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-ink bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5"
                  >
                    L01 slides ↗
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article className="mt-6 border-2 border-ink bg-card p-6 shadow-hard md:p-8">
            <div className="grid gap-6 md:grid-cols-[6rem_1fr]">
              <span className="font-display text-5xl font-bold tracking-tighter text-primary">L02</span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                  Coding on a Budget
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Model choice as a hiring decision: capability, task fit, and
                  total cost. The prompt-run-refine loop, practiced by hand.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://docs.google.com/presentation/d/1usDNjQSZBv8fafI1AeJde9AlNLP2PyJFD3fqTxpFNHw/edit?slide=id.L02Bi6ac073da#slide=id.L02Bi6ac073da"
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-ink bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5"
                  >
                    L02 slides ↗
                  </a>
                </div>
              </div>
            </div>
          </article>

          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            More lectures posted weekly, after each Thursday session.
          </p>
        </div>
      </main>
    </CourseLayout>
  );
}
