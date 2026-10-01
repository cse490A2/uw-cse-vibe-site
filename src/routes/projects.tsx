import { createFileRoute } from "@tanstack/react-router";
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
  return <CourseLayout>
    <main className="min-h-[55vh]">
      <div className="border-b-4 border-ink bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-6xl px-5"><p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">CSE 490 A2 / Course material</p><h1 className="font-display text-5xl uppercase leading-none text-gold sm:text-7xl">Projects</h1></div>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <article className="border-4 border-ink">
          <div className="flex flex-wrap justify-between gap-2 bg-ink px-5 py-3 text-xs font-bold uppercase text-gold"><span>$ start project_01</span><span>Due Tuesday · 11:59 pm</span></div>
          <div className="grid gap-6 p-6 md:grid-cols-[8rem_1fr] md:p-8">
            <span className="font-display text-5xl text-primary">P01</span>
            <div><h2 className="font-display text-3xl uppercase leading-tight md:text-4xl">Prompt to Web App</h2>
              <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed">Make a mobile web app with Lovable or UW Purple, iterate until it works, annotate one change, then submit the app and your prompts.</p>
              <a href="https://docs.google.com/document/d/1oVu3xm0ZjZC76yPapBNvbeihzR1_-iP2IRl2FBG35hw/edit" target="_blank" rel="noreferrer" className="mt-7 inline-block border-4 border-ink bg-gold px-5 py-3 text-sm font-bold uppercase transition-colors hover:bg-primary hover:text-primary-foreground">P01 handout ↗</a>
            </div>
          </div>
        </article>
      </div>
    </main>
  </CourseLayout>;
}