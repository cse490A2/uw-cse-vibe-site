import { createFileRoute } from "@tanstack/react-router";
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
  return <CourseLayout>
    <main className="min-h-[55vh]">
      <div className="border-b-4 border-ink bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-6xl px-5"><p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">CSE 490 A2 / Course material</p><h1 className="font-display text-5xl uppercase leading-none text-gold sm:text-7xl">Lectures</h1></div>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <article className="grid gap-6 border-4 border-ink p-6 md:grid-cols-[8rem_1fr] md:p-8">
          <span className="font-display text-5xl text-primary">L01</span>
          <div><h2 className="font-display text-3xl uppercase leading-tight md:text-4xl">Intro + Prompt to App</h2>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed">Introduce the class, build your first end-to-end app, and examine how to steer and verify AI-assisted code.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://drive.google.com/drive/folders/17AsDt0xtHcmSvpeLSEoSSTRtdhB2xzbH" target="_blank" rel="noreferrer" className="border-4 border-ink bg-gold px-5 py-3 text-sm font-bold uppercase transition-colors hover:bg-primary hover:text-primary-foreground">L01 materials ↗</a>
              <a href="https://canvas.uw.edu/courses/1916846" target="_blank" rel="noreferrer" className="border-4 border-ink px-5 py-3 text-sm font-bold uppercase transition-colors hover:bg-ink hover:text-gold">Readings ↗</a>
            </div>
          </div>
        </article>
      </div>
    </main>
  </CourseLayout>;
}