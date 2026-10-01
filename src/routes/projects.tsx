import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseLayout } from "@/components/course-shell";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [
    { title: "Projects | UW CSE 490 A2 Vibe Coding" },
    { name: "description", content: "Projects for UW CSE 490 A2 Vibe Coding, beginning with P01: Prompt to Web App." },
    { property: "og:title", content: "Projects | UW CSE 490 A2 Vibe Coding" },
    { property: "og:description", content: "Browse Vibe Coding projects and handouts, beginning with P01: Prompt to Web App." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Projects,
});

function Projects() {
  return (
    <CourseLayout>
      <main className="min-h-[55vh]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
            <Link to="/" className="hover:underline">Vibe Coding</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Projects</span>
          </nav>
          <p className="mt-6 inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
            Course material
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter sm:text-5xl">
            Projects
          </h1>

          <article className="mt-10 border-2 border-ink bg-card shadow-hard">
            <div className="flex flex-wrap justify-between gap-2 border-b-2 border-ink bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-gold">
              <span>$ start project_01</span>
              <span>Due Tuesday · 11:59 pm</span>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[6rem_1fr] md:p-8">
              <span className="font-display text-5xl font-bold tracking-tighter text-primary">P01</span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                  Prompt to Web App
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Make a web app with Lovable or UW Purple, iterate until
                  it works, annotate one change, then submit the app and your
                  prompts.
                </p>
                <a
                  href="https://cse490a2.github.io/uw-cse-vibe-course/projects/P01/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block border-2 border-ink bg-gold px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
                >
                  P01 handout ↗
                </a>
              </div>
            </div>
          </article>

          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            A new project ships every week, due the following Tuesday.
          </p>
        </div>
      </main>
    </CourseLayout>
  );
}
