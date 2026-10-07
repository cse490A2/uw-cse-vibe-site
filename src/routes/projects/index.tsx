import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { listProjects } from "@/lib/published";
import { CourseLayout } from "@/components/course-shell";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Vibe Coding, CSE 490 A2" },
      {
        name: "description",
        content: "Every weekly project: the handout, setup, and what to turn in.",
      },
    ],
  }),
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const q = useQuery({
    queryKey: ["published", "projects"],
    queryFn: listProjects,
    enabled: typeof window !== "undefined",
    staleTime: 60_000,
  });

  return (
    <CourseLayout>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link
            to="/"
            className="font-mono text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          >
            ← Vibe Coding
          </Link>
          <p className="mt-6 inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
            projects
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-tighter sm:text-4xl">
            Ten Thursdays, ten builds
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Each project is published the week it goes live. Open one for its handout, setup, and
            what to turn in.
          </p>

          {q.isPending && (
            <p className="mt-10 font-mono text-sm text-muted-foreground">
              Loading the project list…
            </p>
          )}
          {q.isError && (
            <div className="mt-10 border-2 border-ink bg-secondary p-4 shadow-hard-sm">
              <p className="font-medium">The project list did not load.</p>
              <button
                onClick={() => q.refetch()}
                className="mt-3 inline-flex items-center border-2 border-ink bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-hard-sm"
              >
                Try again
              </button>
            </div>
          )}
          {q.data && (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {q.data.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/projects/$"
                    params={{ _splat: p.id }}
                    className="group flex items-center justify-between border-4 border-ink bg-card p-5 shadow-hard-sm transition-transform hover:-translate-y-0.5"
                  >
                    <span>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                        {p.id}
                      </span>
                      <span className="mt-1 block text-lg font-bold uppercase tracking-tight">
                        Project {Number(p.id.slice(1))}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {["handout", ...p.pages.filter((x) => x !== "handout")].join(" · ")}
                        {p.starterZip ? " · starter files" : ""}
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </CourseLayout>
  );
}
