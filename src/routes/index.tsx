import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
        <section id="lecture" className="relative overflow-hidden border-b-4 border-ink bg-primary text-primary-foreground">
          <div className="float-one absolute right-8 top-7 hidden size-14 place-items-center border-4 border-ink bg-gold font-display text-xl text-ink md:grid">01</div>
          <div className="float-two absolute bottom-10 right-28 hidden size-12 place-items-center border-4 border-gold bg-ink font-display text-base text-gold md:grid">&gt;_</div>
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="mb-5 text-sm font-bold uppercase tracking-widest text-gold">Current lecture · Week 01</p>
            <h2 className="font-display text-5xl leading-[0.9] uppercase text-gold md:text-6xl">INTRO<br />+ PROMPT TO APP</h2>
            <p className="mt-6 max-w-xl text-sm font-bold leading-relaxed">Today we introduce the class and build your first end-to-end app. We’ll move from natural-language intent to a working product—and examine the steering and verification around the code.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://canvas.uw.edu/courses/1916846" target="_blank" rel="noreferrer" className="border-4 border-ink bg-gold px-5 py-3 text-sm font-bold uppercase text-ink transition-colors hover:bg-paper">Open readings →</a>
              <a href="https://drive.google.com/drive/folders/17AsDt0xtHcmSvpeLSEoSSTRtdhB2xzbH" target="_blank" rel="noreferrer" className="border-4 border-gold bg-ink px-5 py-3 text-sm font-bold uppercase text-gold transition-colors hover:bg-primary">Lecture materials →</a>
              <Link to="/lectures" className="border-4 border-gold px-5 py-3 text-sm font-bold uppercase text-gold transition-colors hover:bg-gold hover:text-ink">All lectures →</Link>
            </div>
          </div>
        </section>

        <section id="project" className="border-b-4 border-ink">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">[ now_building ]</p>
            <div className="border-4 border-ink">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-ink px-4 py-3 text-gold">
                <span className="text-sm font-bold uppercase">$ start project_01</span>
                <span className="text-xs font-bold uppercase tracking-widest">Due Tuesday · 11:59 pm</span>
              </div>
              <div className="grid items-end gap-7 p-6 md:grid-cols-[1fr_auto] md:p-8">
                <div>
                  <h2 className="font-display text-4xl leading-[0.9] uppercase md:text-5xl">Project 01<br /><span className="text-primary">Prompt to Web App</span></h2>
                  <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed">You have 40 minutes. Make a cool mobile web app with Lovable or UW Purple, iterate until it works, annotate one change, then submit the app and your prompts.</p>
                </div>
                <Link to="/projects" className="border-4 border-ink bg-primary px-6 py-4 text-center text-sm font-bold uppercase text-primary-foreground transition-colors hover:bg-ink">All projects →</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="border-b-4 border-ink">
          <div className="mx-auto grid max-w-6xl border-x-4 border-ink bg-ink md:grid-cols-3">
            <Resource title="Canvas" heading="Slides · readings · submissions" body="Course files, weekly readings, project submissions, and announcements." href="https://canvas.uw.edu/courses/1916846" link="Open Canvas →" />
            <Resource title="Ed" heading="Questions · discussion" body="Ask questions, compare approaches, and get help from the instructional team." href="https://edstem.org/us/courses/107539/discussion" link="Open Ed →" />
            <Resource title="Course Drive" heading="Materials · handouts" body="The living collection of lecture decks, course details, and project briefs." href="https://drive.google.com/drive/folders/17AsDt0xtHcmSvpeLSEoSSTRtdhB2xzbH" link="Open Drive →" />
          </div>
        </section>
      </main>

    </CourseLayout>
  );
}

function Resource({ title, heading, body, href, link }: { title: string; heading: string; body: string; href: string; link: string }) {
  return (
    <article className="bg-paper p-6 md:border-r-4 md:border-ink md:last:border-r-0">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{title}</p>
      <h2 className="font-display text-2xl leading-none uppercase">{heading}</h2>
      <p className="mt-4 text-sm font-bold leading-relaxed">{body}</p>
      <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-block border-b-4 border-gold pb-1 text-sm font-bold uppercase transition-colors hover:bg-primary hover:text-primary-foreground">{link}</a>
    </article>
  );
}
