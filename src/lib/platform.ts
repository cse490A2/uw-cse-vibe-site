// A setup guide carries the same steps once per computer: a heading named
// "Mac", "Windows" or "Linux" opens a block that runs to the next heading of
// the same or a higher level. The page shows one computer's blocks at a time
// and lists the headings that remain, so a reader jumps to a step instead of
// scrolling past two other computers' copies of it.

export type Platform = "mac" | "windows" | "linux";

export const PLATFORMS: Platform[] = ["mac", "windows", "linux"];

export const PLATFORM_LABEL: Record<Platform, string> = {
  mac: "Mac",
  windows: "Windows",
  linux: "Linux",
};

const PLATFORM_NAMES: Record<string, Platform> = {
  mac: "mac",
  macos: "mac",
  "mac os": "mac",
  windows: "windows",
  linux: "linux",
};

const STORAGE_KEY = "cse490.platform";

/** The computer the browser reports, as a default for first-time readers. */
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "mac";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return "mac";
}

export function loadPlatform(): Platform | undefined {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return PLATFORMS.includes(v as Platform) ? (v as Platform) : undefined;
  } catch {
    return undefined;
  }
}

export function savePlatform(p: Platform): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, p);
  } catch {
    // private windows and blocked storage: the choice lasts for the page
  }
}

/** A heading's words without Markdown emphasis or escapes. */
export function headingText(raw: string): string {
  return raw
    .replace(/\\(.)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

export function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface Segment {
  platform?: Platform;
  lines: string[];
}

export interface PlatformSplit {
  segments: Segment[];
  platforms: Platform[]; // in the order the document names them
}

function headingOf(line: string): { level: number; text: string } | undefined {
  const m = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!m || !m[1] || m[2] === undefined) return undefined;
  return { level: m[1].length, text: headingText(m[2]) };
}

/** Cut the document into plain segments and per-computer segments. */
export function splitPlatforms(md: string): PlatformSplit {
  const segments: Segment[] = [];
  const platforms: Platform[] = [];
  let current: Segment = { lines: [] };
  let openLevel = 0; // the level of the heading that opened the current platform block
  let inFence = false;

  const close = () => {
    if (current.lines.length) segments.push(current);
  };

  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = inFence ? undefined : headingOf(line);
    if (h) {
      const named = PLATFORM_NAMES[h.text.toLowerCase()];
      if (named) {
        close();
        current = { platform: named, lines: [] };
        openLevel = h.level;
        if (!platforms.includes(named)) platforms.push(named);
      } else if (current.platform && h.level <= openLevel) {
        close();
        current = { lines: [] };
        openLevel = 0;
      }
    }
    current.lines.push(line);
  }
  close();
  return { segments, platforms };
}

/** The document as one computer's reader sees it. */
export function forPlatform(split: PlatformSplit, platform: Platform): string {
  return split.segments
    .filter((s) => !s.platform || s.platform === platform)
    .map((s) => s.lines.join("\n"))
    .join("\n");
}

/**
 * Heading ids in document order. A repeated text gets a numbered id, the
 * same way the renderer numbers it, so every list entry lands on its heading.
 */
export function makeIdAllocator(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slug(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

/** The headings of a document, levels `minLevel` to `maxLevel`, with their ids. */
export function headings(md: string, minLevel = 2, maxLevel = 4): Heading[] {
  const out: Heading[] = [];
  const nextId = makeIdAllocator();
  let inFence = false;
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const h = headingOf(line);
    if (!h || !h.text) continue;
    const id = nextId(h.text); // every heading takes an id, so numbering matches the page
    if (PLATFORM_NAMES[h.text.toLowerCase()]) continue; // the picker already names the computer
    if (h.level >= minLevel && h.level <= maxLevel) out.push({ level: h.level, text: h.text, id });
  }
  return out;
}
