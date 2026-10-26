import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseLayout } from "@/components/course-shell";
import { LatePolicy } from "@/components/late-policy";
import { lecture } from "@/lib/lectures";
import { listProjects } from "@/lib/published";

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

// Titles match the slides and handouts once they are posted; later weeks
// are the planned topics.
const SCHEDULE = [
  { week: "01", lecture: "Intro + Prompt to App", project: "Prompt to Web App" },
  { week: "02", lecture: "Coding on a Budget", project: "Insert Prompt to Play" },
  { week: "03", lecture: "The Agent Harness", project: "The Agent Harness" },
  { week: "04", lecture: "Agent Steering", project: "Driving a Coding Agent" },
  { week: "05", lecture: "MCP and Agent Governance", project: "Wire an MCP Tool" },
  { week: "06", lecture: "Working in Code You Did Not Write", project: "Review a Stranger's Code" },
  { week: "07", lecture: "Multi-Agent Orchestration", project: "Orchestrate Sub-Agents" },
  { week: "08", lecture: "Local Models", project: "Local-First Cascade" },
  { week: "09", lecture: "Evals", project: "Eval Suite (optional)" },
  { week: "10", lecture: "Deploy Behind CI", project: "Ship a Project" },
];

function Index() {
  // Same query as the projects page: a schedule row links to its handout
  // once that project is published.
  const projects = useQuery({
    queryKey: ["published", "projects"],
    queryFn: listProjects,
    enabled: typeof window !== "undefined",
    staleTime: 60_000,
  });
  const published = new Set(projects.data?.map((p) => p.id));

  return (
    <CourseLayout>
      <main>
        {/* Hero */}
        <section id="overview" className="border-b-2 border-ink">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="inline-block border-2 border-ink bg-gold px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-hard-sm">
              Autumn 2026 · UW CSE 490 A2 · 2 credits
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold uppercase tracking-tighter sm:text-7xl">
              Vibe <span className="text-primary">Coding</span>
            </h1>
            <p className="mt-6 text-lg font-medium leading-relaxed">
              Learn the latest AI-based tools for software development — by
              building. Ten Thursdays, ten builds: from a single prompt to a
              shipped app. The goal: build your own Claude Code — a coding
              agent with a harness, tools, and guardrails you understand.
            </p>
            <p className="mt-4 font-mono text-sm text-muted-foreground">
              Thursdays 10:00–11:20 · Savery 260 · Steve Seitz
            </p>
          </div>
        </section>

        {/* This week */}
        <section className="border-b-2 border-ink">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
              This week
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="border-2 border-ink bg-card p-6 shadow-hard">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Lecture 04 · Thu 10:00
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
                  Agent Steering
                </h3>
                <a
                  href={lecture("L04")?.slides}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block border-2 border-ink bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-hard-sm transition-transform hover:-translate-y-0.5"
                >
                  Slides ↗
                </a>
              </article>
              <article className="border-2 border-ink bg-card p-6 shadow-hard">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Project 04 · Due Tue 11:59 pm
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
                  Driving a Coding Agent
                </h3>
                <Link
                  to="/projects/$"
                  params={{ _splat: "P04" }}
                  className="mt-4 inline-block border-2 border-ink bg-gold px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
                >
                  Handout
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section id="syllabus" className="border-b-2 border-ink bg-secondary">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
              Schedule
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tighter sm:text-4xl">
              Ten Thursdays, ten builds
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The sequence starts with the fastest possible win — a prompt
              becomes a working app in session one — then climbs through
              prompting method, the agentic loop, agents, and closes on evals
              and shipping.
            </p>
            <div className="mt-8 border-2 border-ink bg-card shadow-hard-lg">
              <div className="grid grid-cols-[4rem_1fr] gap-4 border-b-2 border-ink bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground md:grid-cols-[6rem_1fr_1fr]">
                <span>Week</span>
                <span>Lecture</span>
                <span className="hidden md:block">Project</span>
              </div>
              <ul className="divide-y-2 divide-ink">
                {SCHEDULE.map((row) => (
                  <SyllabusRow
                    key={row.week}
                    {...row}
                    slides={lecture(`L${row.week}`)?.slides}
                    projectId={published.has(`P${row.week}`) ? `P${row.week}` : undefined}
                  />
                ))}
              </ul>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Full detail on the <Link to="/lectures" className="text-primary underline underline-offset-4 hover:no-underline">lectures</Link> and <Link to="/projects" className="text-primary underline underline-offset-4 hover:no-underline">projects</Link> pages.
            </p>
          </div>
        </section>

        {/* Late policy */}
        <section id="late-policy" className="border-b-2 border-ink">
          <LatePolicy className="mx-auto max-w-6xl px-6 py-8" />
        </section>
      </main>
    </CourseLayout>
  );
}

const rowLink = "underline decoration-2 underline-offset-4 hover:text-primary hover:no-underline";

function SyllabusRow({
  week,
  lecture,
  project,
  slides,
  projectId,
}: {
  week: string;
  lecture: string;
  project: string;
  slides?: string | undefined;
  projectId?: string | undefined;
}) {
  const projectLabel = projectId ? (
    <Link to="/projects/$" params={{ _splat: projectId }} className={rowLink}>
      {project}
    </Link>
  ) : (
    project
  );
  return (
    <li className="grid grid-cols-[4rem_1fr] gap-4 px-5 py-4 md:grid-cols-[6rem_1fr_1fr]">
      <span className="font-mono text-sm font-bold text-primary">L{week}</span>
      <span>
        <span className="block font-bold">
          {slides ? (
            <a href={slides} target="_blank" rel="noreferrer" className={rowLink}>
              {lecture} ↗
            </a>
          ) : (
            lecture
          )}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground md:hidden">{projectLabel}</span>
      </span>
      <span className="hidden text-sm text-muted-foreground md:block">{projectLabel}</span>
    </li>
  );
}
