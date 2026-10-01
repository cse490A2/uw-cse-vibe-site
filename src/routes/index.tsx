import { createFileRoute } from "@tanstack/react-router";
import { CourseLayout } from "@/components/course-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibe Coding | UW CSE 490 A2" },
      {
        name: "description",
        content:
          "UW CSE 490 A2: hands-on AI-assisted software development with Steve Seitz and the UW CSE instructional team.",
      },
      { property: "og:title", content: "Vibe Coding | UW CSE 490 A2" },
      {
        property: "og:description",
        content:
          "Build, evaluate, and ship software with today's AI coding tools at the University of Washington.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CourseLayout isHome>
      <main>
        <section id="overview" className="relative overflow-hidden border-b-4 border-ink bg-primary text-primary-foreground">
          <div className="float-one absolute right-8 top-7 hidden size-14 place-items-center border-4 border-ink bg-gold font-display text-xl text-ink md:grid">01</div>
          <div className="mx-auto max-w-6xl px-5 py-12">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">CSE 490 A2 · Autumn 2026</p>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed">
              Vibe Coding is a hands-on course on building real applications with AI coding tools. In weekly lectures we move from natural-language intent to working product, studying the prompting, steering, and verification that gets you there. Every week ends in a project you ship — no prior AI experience needed, just a laptop.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed">
              The course project: build your own version of Claude Code.
            </p>

            <div className="mt-8 max-w-3xl border-4 border-ink bg-ink text-gold">
              <div className="flex items-center justify-between border-b-4 border-gold px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-widest">This week</span>
                <span className="text-xs font-bold uppercase tracking-widest">Week 01</span>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="border-b-4 border-gold px-4 py-3 md:border-b-0 md:border-r-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground">Lecture 01 · Thu 10:00</p>
                  <p className="mt-1 font-display text-lg leading-tight uppercase">Intro + Prompt to App</p>
                  <a href="https://docs.google.com/presentation/d/1JZoVNiDwyTnzxVSkouKSFZrMMMMPnqpKgVpodDX83_k/edit" target="_blank" rel="noreferrer" className="mt-2 inline-block border-b-2 border-gold text-xs font-bold uppercase transition-colors hover:bg-gold hover:text-ink">Slides →</a>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground">Project 01 · Due Tue 11:59 pm</p>
                  <p className="mt-1 font-display text-lg leading-tight uppercase">Prompt to Web App</p>
                  <a href="https://cse490a2.github.io/uw-cse-vibe-course/projects/P01/" target="_blank" rel="noreferrer" className="mt-2 inline-block border-b-2 border-gold text-xs font-bold uppercase transition-colors hover:bg-gold hover:text-ink">Handout →</a>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section id="syllabus" className="border-b-4 border-ink">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">CSE 490 A2 / Autumn 2026</p>
            <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">Syllabus</h2>
            <ul className="mt-8 divide-y-4 divide-ink border-4 border-ink">
              <SyllabusRow week="Week 01" lecture="L01 · Intro + Prompt to App" project="P01 · Prompt to Web App" />
            </ul>
            <p className="mt-6 text-sm font-bold uppercase">More weeks announced as the quarter unfolds.</p>
          </div>
        </section>
      </main>

    </CourseLayout>
  );
}

function SyllabusRow({ week, lecture, project }: { week: string; lecture: string; project: string }) {
  return (
    <li className="grid gap-2 bg-paper p-5 text-sm font-bold uppercase md:grid-cols-[8rem_1fr_1fr] md:gap-6">
      <span className="text-primary">{week}</span>
      <span>{lecture}</span>
      <span>{project}</span>
    </li>
  );
}
