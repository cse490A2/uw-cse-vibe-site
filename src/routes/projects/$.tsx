import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { ProjectMarkdown } from "@/components/ProjectMarkdown";
import {
  PAGE_FILE,
  PUBLISHED_RAW,
  PUBLISHED_REPO,
  fetchText,
  isProjectId,
  listProjects,
  projectTitle,
  stripFrontMatter,
  type ProjectPage,
} from "@/lib/published";
import { CourseLayout } from "@/components/course-shell";

// /projects/P02, /projects/P02/setup, /projects/P02/submission
// One route for every project: the splat is "<id>" or "<id>/<page>".

function parseSplat(splat: string | undefined): { id: string; page: ProjectPage } {
  const [id, page = "handout"] = (splat ?? "").split("/");
  if (!isProjectId(id) || !(page in PAGE_FILE)) throw notFound();
  return { id, page: page as ProjectPage };
}

export const Route = createFileRoute("/projects/$")({
  head: ({ params }) => {
    const [id] = (params._splat ?? "").split("/");
    return { meta: [{ title: `${id || "Project"} — Vibe Coding, CSE 490 A2` }] };
  },
  component: ProjectView,
});

const LABEL: Record<ProjectPage, string> = {
  handout: "Handout",
  setup: "Setup",
  submission: "Submission",
};

function ProjectView() {
  const { _splat } = Route.useParams();
  const { id, page } = parseSplat(_splat);
  const onClient = typeof window !== "undefined";

  const doc = useQuery({
    queryKey: ["published", id, page],
    queryFn: () => fetchText(`projects/${id}/${PAGE_FILE[page]}`),
    enabled: onClient,
    staleTime: 60_000,
  });
  const handout = useQuery({
    queryKey: ["published", id, "handout"],
    queryFn: () => fetchText(`projects/${id}/README.md`),
    enabled: onClient,
    staleTime: 60_000,
  });
  const projects = useQuery({
    queryKey: ["published", "projects"],
    queryFn: listProjects,
    enabled: onClient,
    staleTime: 60_000,
  });
  const meta = projects.data?.find((p) => p.id === id);
  const title = handout.data ? projectTitle(handout.data, id) : id;

  return (
    <CourseLayout>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
            <Link to="/" className="hover:underline">
              Vibe Coding
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{id}</span>
          </nav>

          <p className="mt-6 inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
            {LABEL[page].toLowerCase()}
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-tighter sm:text-4xl">
            {title}
          </h1>

          {/* the project's pages, as tabs; only the ones that exist */}
          <div className="mt-8 flex flex-wrap gap-2 border-b-4 border-ink pb-4">
            {(meta?.pages ?? ["handout"]).map((p) => (
              <Link
                key={p}
                to="/projects/$"
                params={{ _splat: p === "handout" ? id : `${id}/${p}` }}
                className={
                  "border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm " +
                  (p === page ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")
                }
              >
                {LABEL[p]}
              </Link>
            ))}
            {meta?.starterZip && (
              <a
                href={`${PUBLISHED_RAW}/projects/${id}/starter.zip`}
                className="inline-flex items-center gap-1.5 border-2 border-ink bg-gold px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-gold-foreground shadow-hard-sm"
              >
                <Download className="h-3.5 w-3.5" /> Starter files
              </a>
            )}
          </div>

          <article className="mt-8">
            {doc.isPending && (
              <p className="font-mono text-sm text-muted-foreground">
                Loading {LABEL[page].toLowerCase()}…
              </p>
            )}
            {doc.isError && (
              <div className="border-2 border-ink bg-secondary p-4 shadow-hard-sm">
                <p className="font-medium">
                  This page did not load from the course repository.
                  <span className="block text-sm text-muted-foreground">{String(doc.error)}</span>
                </p>
                <button
                  onClick={() => doc.refetch()}
                  className="mt-3 inline-flex items-center border-2 border-ink bg-primary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-hard-sm"
                >
                  Try again
                </button>
              </div>
            )}
            {doc.data && <ProjectMarkdown id={id} markdown={stripFrontMatter(doc.data)} />}
          </article>

          <p className="mt-16 border-t-2 border-ink pt-4 text-sm text-muted-foreground">
            Rendered from{" "}
            <a
              href={`${PUBLISHED_REPO}/blob/main/projects/${id}/${PAGE_FILE[page]}`}
              className="font-semibold text-primary underline"
              target="_blank"
              rel="noreferrer"
            >
              projects/{id}/{PAGE_FILE[page]}
            </a>{" "}
            in the course repository. An edit there shows here within a few minutes.
          </p>
        </div>
      </main>
    </CourseLayout>
  );
}
