import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PageGuide } from "@/components/PageGuide";
import { StepPager, StepSidebar } from "@/components/StepNav";
import { plainTitle, splitSections } from "@/lib/sections";
import { ProjectMarkdown, hasPlatformCommands } from "@/components/ProjectMarkdown";
import {
  PLATFORMS,
  detectPlatform,
  forPlatform,
  headings,
  loadPlatform,
  savePlatform,
  splitPlatforms,
  type Platform,
} from "@/lib/platform";
import {
  PAGE_FILE,
  PUBLISHED_RAW,
  RUBRICS,
  fetchText,
  isProjectId,
  listProjects,
  projectTitle,
  stripFrontMatter,
  type ProjectPage,
} from "@/lib/published";
import { CourseLayout, NewTab } from "@/components/course-shell";
import { PROXY_PROJECTS, VpnNotice } from "@/components/vpn-notice";

// /projects/P02, /projects/P02/setup, /projects/P02/submission
// One route for every project: the splat is "<id>" or "<id>/<page>".

function parseSplat(splat: string | undefined): { id: string; page: ProjectPage } {
  const [id, page = "handout"] = (splat ?? "").split("/");
  if (!isProjectId(id) || !(page in PAGE_FILE)) throw notFound();
  return { id, page: page as ProjectPage };
}

export const Route = createFileRoute("/projects/$")({
  beforeLoad: ({ params }) => {
    parseSplat(params._splat);
  },
  head: ({ params }) => {
    const [id, page] = (params._splat ?? "").split("/");
    // each page of a project gets its own title: "P04 Setup", not just "P04"
    const name = page && page in LABEL ? `${id} ${LABEL[page as ProjectPage]}` : id || "Project";
    return { meta: [{ title: `${name} — Vibe Coding, CSE 490 A2` }] };
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

  // One computer's view of a document that repeats its steps per computer,
  // and the headings of that view. The choice is remembered across pages.
  const split = useMemo(() => splitPlatforms(stripFrontMatter(doc.data ?? "")), [doc.data]);
  const [chosen, setChosen] = useState<Platform | undefined>(undefined);
  useEffect(() => {
    setChosen(loadPlatform() ?? detectPlatform());
  }, []);
  // a document that labels commands by computer offers every computer, even
  // when its per-computer blocks name fewer (the wizard download names two)
  const labelled = useMemo(() => hasPlatformCommands(doc.data ?? ""), [doc.data]);
  const offered: Platform[] = labelled ? PLATFORMS : split.platforms;
  const platform: Platform =
    chosen && offered.includes(chosen) ? chosen : (offered[0] ?? chosen ?? "mac");
  const choosePlatform = (p: Platform) => {
    setChosen(p);
    savePlatform(p);
  };
  const shown = useMemo(
    () =>
      split.platforms.length ? forPlatform(split, platform) : stripFrontMatter(doc.data ?? ""),
    [split, platform, doc.data],
  );
  const toc = useMemo(() => headings(shown), [shown]);

  // One step at a time: the document cut at its step headings, a sidebar of
  // them, and the step named in the URL's hash shown (the first when none).
  const allSections = useMemo(() => splitSections(shown), [shown]);
  // with a computer chosen, a step marked for other computers is not shown
  // and a step's own "(Windows only)" mark is implied by the choice
  const sections = useMemo(
    () =>
      labelled
        ? allSections
            .filter((s) => !s.only || s.only.includes(platform))
            .map((s) => ({ ...s, title: plainTitle(s.title) }))
        : allSections,
    [allSections, labelled, platform],
  );
  const stepped = page === "setup" && sections.length > 1; // a handout stays one page
  const [stepId, setStepId] = useState<string>("");
  useEffect(() => {
    const fromHash = () => setStepId(window.location.hash.replace(/^#/, ""));
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  const stepIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === stepId),
  );
  const articleRef = useRef<HTMLElement>(null);
  const pickStep = (i: number) => {
    const s = sections[i];
    if (!s) return;
    setStepId(s.id);
    window.history.replaceState(null, "", `#${s.id}`);
    articleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    articleRef.current?.focus({ preventScroll: true });
  };

  return (
    <CourseLayout>
      <main
        id="main"
        tabIndex={-1}
        className="focus:outline-none min-h-screen bg-background text-foreground"
      >
        <div className={"mx-auto px-6 py-16 " + (stepped ? "max-w-6xl" : "max-w-4xl")}>
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Link to="/" className="hover:underline">
              Vibe Coding
            </Link>
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <span aria-current="page" className="text-foreground">
              {id}
            </span>
          </nav>

          <p className="mt-6 inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
            {LABEL[page].toLowerCase()}
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-tighter sm:text-4xl">
            {title}
          </h1>

          {/* the project's pages, as tabs; only the ones that exist. Each is
              its own route, so this is a nav with a current page, not a tablist */}
          <nav
            aria-label="Project pages"
            className="mt-8 flex flex-wrap gap-2 border-b-4 border-ink pb-4"
          >
            {(meta?.pages ?? ["handout"]).map((p) => (
              <Link
                key={p}
                to="/projects/$"
                params={{ _splat: p === "handout" ? id : `${id}/${p}` }}
                aria-current={p === page ? "page" : undefined}
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
            {RUBRICS[id] && (
              <a
                href={RUBRICS[id]}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-ink bg-card px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm hover:bg-secondary"
              >
                Rubric
                <NewTab />
              </a>
            )}
          </nav>

          {PROXY_PROJECTS.has(id) && <VpnNotice className="mt-8" />}

          {doc.data && (
            <PageGuide
              platforms={offered}
              platform={platform}
              onPlatform={choosePlatform}
              items={stepped ? [] : toc}
            />
          )}

          <div className={stepped ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : ""}>
            {doc.data && stepped && (
              <aside className="mt-8">
                <StepSidebar sections={sections} index={stepIndex} onPick={pickStep} />
              </aside>
            )}

            {/* break long URLs, paths and commands so a phone never scrolls sideways */}
            <article
              ref={articleRef}
              tabIndex={-1}
              aria-busy={doc.isPending}
              className="mt-8 scroll-mt-24 wrap-break-word focus:outline-none"
            >
              {doc.isPending && (
                <p role="status" className="font-mono text-sm text-muted-foreground">
                  Loading {LABEL[page].toLowerCase()}…
                </p>
              )}
              {doc.isError && (
                <div role="alert" className="border-2 border-ink bg-secondary p-4 shadow-hard-sm">
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
              {doc.data && stepped && sections[stepIndex]?.group && (
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {sections[stepIndex]?.group}
                </p>
              )}
              {doc.data && (
                <ProjectMarkdown
                  id={id}
                  platform={labelled ? platform : undefined}
                  markdown={
                    stepped ? (sections[stepIndex]?.body ?? "").replace(/^#{2,6}\s+/, "# ") : shown
                  }
                />
              )}
              {doc.data && stepped && (
                <StepPager sections={sections} index={stepIndex} onPick={pickStep} />
              )}
            </article>
          </div>
        </div>
      </main>
    </CourseLayout>
  );
}
