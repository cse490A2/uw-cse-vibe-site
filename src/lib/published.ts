// The course materials live in one place: the cse490-published repository,
// a frozen export of the finished documents on the course drive. This site
// holds pointers to those files and renders them in its own styles, so a
// handout edit shows up here after the next publish, and a theme change
// here restyles every project at once.
//
// Every project folder has the same shape (owner direction 2026-09-28):
//   projects/PNN/README.md      the handout
//   projects/PNN/SETUP.md       prerequisites and tool setup
//   projects/PNN/SUBMISSION.md  what to turn in
//   projects/PNN/starter/       starter files, and starter.zip as one download
//   projects/PNN/examples/      filled-in samples the handout links to
//   projects/PNN/images/        screenshots the pages embed

export const PUBLISHED_REPO = "https://github.com/cse490A2/cse490-published";
export const PUBLISHED_RAW = "https://raw.githubusercontent.com/cse490A2/cse490-published/main";
export const PUBLISHED_PAGES = "https://cse490a2.github.io/cse490-published";

export type ProjectPage = "handout" | "setup" | "submission";

export const PAGE_FILE: Record<ProjectPage, string> = {
  handout: "README.md",
  setup: "SETUP.md",
  submission: "SUBMISSION.md",
};

export interface PublishedProject {
  id: string; // "P02"
  pages: ProjectPage[];
  starterZip: boolean;
}

export function isProjectId(s: string | undefined): s is string {
  return !!s && /^P\d{2}$/.test(s);
}

export async function fetchText(path: string): Promise<string> {
  const res = await fetch(`${PUBLISHED_RAW}/${path}`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

/** The projects that exist, read from the publisher's manifest. */
export async function listProjects(): Promise<PublishedProject[]> {
  const manifest = JSON.parse(await fetchText("PUBLISHED.json")) as Record<string, unknown>;
  const byId = new Map<string, PublishedProject>();
  for (const key of Object.keys(manifest)) {
    const m = /^projects\/(P\d{2})\/([^/]+)$/.exec(key);
    if (!m || !m[1] || !m[2]) continue;
    const id = m[1];
    const file = m[2];
    const p: PublishedProject = byId.get(id) ?? {
      id,
      pages: [] as ProjectPage[],
      starterZip: false,
    };
    if (file === "README.md") p.pages.push("handout");
    else if (file === "SETUP.md") p.pages.push("setup");
    else if (file === "SUBMISSION.md") p.pages.push("submission");
    else if (file === "starter.zip") p.starterZip = true;
    byId.set(id, p);
  }
  return [...byId.values()]
    .filter((p) => p.pages.includes("handout"))
    .map((p) => ({
      ...p,
      pages: (["handout", "setup", "submission"] as ProjectPage[]).filter((x) =>
        p.pages.includes(x),
      ),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** "P02: Insert Prompt to Play" from the handout's title line, else the id. */
export function projectTitle(md: string, id: string): string {
  const fm = md.match(/^---\n[\s\S]*?\ntitle:\s*"?(.*?)"?\n[\s\S]*?\n---/);
  if (fm?.[1]) return fm[1];
  const m = md.match(/^(?:#\s+)?Project\s+0*(\d+):\s*(.*?)\s*$/m);
  if (m?.[1] && m[2] !== undefined)
    return `P${m[1].padStart(2, "0")}: ${m[2].replace(/\\(.)/g, "$1")}`;
  const h = md.match(/^#\s+(.*)/m);
  return h?.[1] ? h[1].replace(/\\(.)/g, "$1").trim() : id;
}

/** Drop the publisher's front matter; the page shows its own title. */
export function stripFrontMatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n\n?/, "");
}

/**
 * Where a link inside a project's Markdown should go from this site.
 * Sibling pages stay on this site; downloads and images come from the
 * published repository; an .html example opens rendered on GitHub Pages.
 * Absolute links are left alone.
 */
export function resolveLink(id: string, href: string): { to?: string; href?: string } {
  if (/^(https?:|mailto:|#)/.test(href)) return { href };
  const clean = href.replace(/^\.\//, "");
  if (/^README\.md$/i.test(clean)) return { to: `/projects/${id}` };
  if (/^SETUP\.md$/i.test(clean)) return { to: `/projects/${id}/setup` };
  if (/^SUBMISSION\.md$/i.test(clean)) return { to: `/projects/${id}/submission` };
  if (/\.html?$/i.test(clean)) return { href: `${PUBLISHED_PAGES}/projects/${id}/${clean}` };
  if (/\.md$/i.test(clean)) return { href: `${PUBLISHED_REPO}/blob/main/projects/${id}/${clean}` };
  return { href: `${PUBLISHED_RAW}/projects/${id}/${clean}` };
}

export function imageSrc(id: string, src: string): string {
  if (/^(https?:|data:)/.test(src)) return src;
  return `${PUBLISHED_RAW}/projects/${id}/${src.replace(/^\.\//, "")}`;
}
