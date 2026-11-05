// A long document read one step at a time. The document is cut at its step
// headings (the deepest heading level that occurs three times or more), the
// way the Rust Book gives each section its own page: a sidebar lists the
// steps, the page shows one, and Previous and Next walk them. A heading one
// level above the steps that introduces a run of them is a group label in
// the sidebar (Part A, Part B, Part 1), not a page of its own. Everything
// before the first step is the Overview.

import { headingText, makeIdAllocator, type Platform } from "./platform";

export interface Section {
  id: string;
  title: string;
  group?: string;
  body: string;
  only?: Platform[]; // a step for these computers alone ("(Windows only)")
}

const ONLY = /\(((?:Mac|Windows|Linux)(?:,? and (?:Mac|Windows|Linux))*) only\)/i;

/** The computers a step heading restricts itself to, or undefined for all. */
export function stepOnly(title: string, group?: string): Platform[] | undefined {
  const m =
    ONLY.exec(title) ??
    /((?:Mac|Windows|Linux)(?:,? and (?:Mac|Windows|Linux))*) only/i.exec(group ?? "");
  if (!m?.[1]) return undefined;
  return m[1].toLowerCase().split(/,? and /) as Platform[];
}

/** A step title without its "(Windows only)" mark. */
export function plainTitle(title: string): string {
  return title
    .replace(ONLY, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function headingOf(line: string): { level: number; text: string } | undefined {
  const m = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!m || !m[1] || m[2] === undefined) return undefined;
  return { level: m[1].length, text: headingText(m[2]) };
}

const MIN_STEPS = 3;

export function splitSections(md: string): Section[] {
  const lines = md.split("\n");
  const hs: { i: number; level: number; text: string }[] = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) return;
    const h = headingOf(line);
    if (h && h.text) hs.push({ i, ...h });
  });
  let L = 0;
  for (const lv of [4, 3, 2]) {
    if (hs.filter((h) => h.level === lv).length >= MIN_STEPS) {
      L = lv;
      break;
    }
  }
  if (!L) return [{ id: "all", title: "", body: md }];

  // a heading one level up is a group when a step follows it before any
  // heading of its own level or higher
  const groupAt = new Set<number>();
  hs.forEach((h, k) => {
    if (h.level !== L - 1) return;
    for (let j = k + 1; j < hs.length; j++) {
      const n = hs[j]!;
      if (n.level === L) {
        groupAt.add(h.i);
        break;
      }
      if (n.level <= L - 1) break;
    }
  });
  const byLine = new Map(hs.map((h) => [h.i, h]));

  const sections: Section[] = [];
  const nextId = makeIdAllocator();
  let title = "Overview";
  let group: string | undefined;
  let buf: string[] = [];
  const flush = () => {
    // the overview drops the document's own title line: the page carries the project's
    const trimmed = sections.length === 0 ? buf.filter((l, k) => !(k < 3 && /^#\s/.test(l))) : buf;
    const body = trimmed.join("\n").trim();
    if (body) {
      const only = stepOnly(title, group);
      sections.push({
        id: nextId(title),
        title,
        body,
        ...(group ? { group } : {}),
        ...(only ? { only } : {}),
      });
    }
    buf = [];
  };
  inFence = false;
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = inFence ? undefined : byLine.get(i);
    if (h && h.level === L) {
      flush();
      title = h.text;
      buf.push(line);
      return;
    }
    if (h && groupAt.has(i)) {
      flush();
      group = h.text;
      title = h.text;
      return; // the group heading is the sidebar label, not page text
    }
    buf.push(line);
  });
  flush();
  return sections;
}
