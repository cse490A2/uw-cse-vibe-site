import { Link } from "@tanstack/react-router";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { NewTab } from "@/components/course-shell";
import { makeIdAllocator, type Platform } from "@/lib/platform";
import { imageSrc, resolveLink } from "@/lib/published";

// A project document, rendered in this site's own type and colors. The
// Markdown comes from the published repository; every style below is a
// site token, so a theme change here restyles the handouts with it.

/** The words inside a heading, for its id. */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** The computers a command label names: "# Mac", "# Linux, and Windows inside Ubuntu". */
function labelPlatforms(label: string): Platform[] {
  const out: Platform[] = [];
  if (/\bmac\b/i.test(label)) out.push("mac");
  if (/\blinux\b/i.test(label)) out.push("linux");
  if (/\bwindows\b/i.test(label)) out.push("windows");
  return out;
}

const CMD_LINE = /^((?:\s*>)*\s*(?:(?:\d+\.|[-*])\s+)?)`([^`]+)`\s*$/;
const BLOCK_LINE = /^((?:\s*>)*\s*)`([^`]+)`\s*$/; // a command line with no list marker
const TROUBLE = /^\*\*(?:If not\.|Troubleshooting\.?)\*\*\s*$/;
const CHECK = /^\*\*Check[.:]\*\*/;

/** True when the document labels any command by computer. */
export function hasPlatformCommands(md: string): boolean {
  return md.split("\n").some((line) => {
    const m = CMD_LINE.exec(line);
    return !!m && /^# /.test(m[2] ?? "") && labelPlatforms(m[2] ?? "").length > 0;
  });
}

const unquote = (line: string) => line.replace(/^(?:\s*>)+\s?/, "");

/** JSON-looking file contents, re-indented by their braces. */
function indentJson(run: string[]): string[] {
  let depth = 0;
  return run.map((l) => {
    const t = l.trim();
    const closer = /^[}\]]/.test(t);
    if (closer) depth = Math.max(0, depth - 1);
    const line = "  ".repeat(depth) + t;
    const opens = (t.match(/[{[]/g) ?? []).length;
    const closes = (t.match(/[}\]]/g) ?? []).length;
    depth = Math.max(0, depth + opens - closes + (closer ? 1 : 0));
    return line;
  });
}

/**
 * The published Markdown, shaped for the page: the chosen computer's command
 * lines only (a "# Mac" label governs the one line after it); every run of
 * command lines as one fenced block with one Copy; the "Check." paragraph and
 * the "Troubleshooting" list each as one quoted block, rendered as a box.
 */
function markCommands(md: string, platform?: Platform): string {
  // a GitHub note, "> [!NOTE]" then its text, becomes a quote that opens with an
  // unseen mark (U+2063); the quote is then drawn as a box, with no label added
  // (a Google Doc exports the mark escaped and on the note's own line)
  md = md.replace(
    /^((?:[ \t]*>)+)[ \t]*\\?\[\\?!NOTE\\?\][ \t]*(?:\n(?:[ \t]*>)+[ \t]*)?/gm,
    "$1 \u2063",
  );
  const src = md.replace(/`[ \u00a0]([,.;:)])/g, "`$1").split("\n");

  // pass 1: labelled command lines, kept or dropped by computer
  const kept: string[] = [];
  const dropped = new Set<string>();
  const keptText = new Set<string>();
  let inFence = false;
  let skipNext = false;
  for (const line of src) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = inFence ? null : CMD_LINE.exec(line);
    if (!m) {
      skipNext = false;
      kept.push(line);
      continue;
    }
    const text = m[2] ?? "";
    if (/^# /.test(text) && labelPlatforms(text).length) {
      if (platform) {
        skipNext = !labelPlatforms(text).includes(platform);
        continue;
      }
      kept.push(line);
      continue;
    }
    if (skipNext) {
      skipNext = false;
      dropped.add(text.trim());
      continue;
    }
    keptText.add(text.trim());
    kept.push(line);
  }

  // the "What am I typing?" table that starts at src[j] (the rows after
  // the label): the rows the chosen computer types, and where it ends
  const takeTableFrom = (src: string[], start: number): { rows: string[]; next: number } => {
    const rows: string[] = [];
    let j = start;
    while (j < src.length && unquote(src[j] ?? "").trim() === "") j++;
    while (j < src.length && /^\s*\|/.test(unquote(src[j] ?? ""))) {
      rows.push(unquote(src[j] ?? "").trim());
      j++;
    }
    const kept: string[] = [];
    let keepGroup = true;
    // a row whose first cell is one of the block's command lines (whole, or
    // its start with an ellipsis) opens a group: that line's token rows follow
    const plain = (cell: string) =>
      cell
        .replace(/\*\*|`/g, "")
        .replace(/\\([\\`*_{}[\]()#+\-.!<>|])/g, "$1")
        .replace(/\u00a6/g, "|")
        .trim();
    const isLine = (t: string, full: string) =>
      t.endsWith("\u2026") ? full.startsWith(t.slice(0, -1)) : full === t;
    rows.forEach((r, k) => {
      if (k < 2) {
        kept.push(r); // the header and separator rows
        return;
      }
      const first = /^\|\s*(.*?)\s*\|/.exec(r)?.[1] ?? "";
      const t = plain(first);
      const inDropped = [...dropped].some((f) => isLine(t, f));
      const inKept = [...keptText].some((f) => isLine(t, f));
      if (inDropped || inKept) keepGroup = !(inDropped && !inKept);
      if (keepGroup) kept.push(r);
    });
    return { rows: kept.length > 2 ? kept : [], next: j };
  };
  const LABEL = /^\*\*What am I typing\?\*\*\s*$/;
  const panel = (rows: string[], quote: string, lead = true) => [
    ...(lead ? [quote.replace(/>\s*$/, "").trimEnd()] : []),
    quote + "**What am I typing?**",
    quote.trimEnd(),
    ...rows.map((r) => quote + r),
    quote.trimEnd() === "" ? "" : quote.trimEnd(),
  ];

  // pass 2: a run of command lines becomes one fenced block
  const blocks: string[] = [];
  inFence = false;
  for (let i = 0; i < kept.length; i++) {
    const line = kept[i] ?? "";
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = inFence ? null : BLOCK_LINE.exec(line);
    if (!m) {
      blocks.push(line);
      continue;
    }
    const prefix = m[1] ?? "";
    const run: string[] = [m[2] ?? ""];
    let j = i + 1;
    for (; j < kept.length; j++) {
      const mm = BLOCK_LINE.exec(kept[j] ?? "");
      if (!mm) break;
      // a line indented further than the run's first line keeps that indent:
      // a Google Doc exports the leading spaces of a code line outside it
      const lead = mm[1] ?? "";
      const extra =
        lead.startsWith(prefix) && /^\s*$/.test(lead.slice(prefix.length))
          ? lead.slice(prefix.length)
          : "";
      run.push(extra + (mm[2] ?? ""));
    }
    const body = /^[{[]/.test(run[0] ?? "") ? indentJson(run) : run;
    blocks.push(prefix + "```text", ...body.map((b) => prefix + b), prefix + "```");
    // the block's "What am I typing?" table follows it in the document; the
    // panel goes right under the fence, in the same item, so they line up
    let k = j;
    while (k < kept.length && unquote(kept[k] ?? "").trim() === "") k++;
    if (k < kept.length && LABEL.test(unquote(kept[k] ?? ""))) {
      const { rows, next } = takeTableFrom(kept, k + 1);
      if (rows.length) blocks.push(...panel(rows, prefix + "> ", false));
      j = next;
    }
    i = j - 1;
  }

  // pass 3: the Check paragraph, the Troubleshooting list and the
  // "What am I typing?" table as quoted blocks (each rendered as a box)
  const out: string[] = [];
  // the panel nests where its block is: inside the same quoted list item,
  // so it lines up with the block instead of the article's edge
  let fencePrefix = "";
  for (let i = 0; i < blocks.length; i++) {
    const line = blocks[i] ?? "";
    const fence = /^((?:\s*>)*\s*)```text\s*$/.exec(line);
    if (fence) fencePrefix = fence[1] ?? "";
    if (/^#{1,6}\s/.test(unquote(line))) fencePrefix = "";
    if (LABEL.test(unquote(line))) {
      const { rows, next } = takeTableFrom(blocks, i + 1);
      if (rows.length) out.push(...panel(rows, fencePrefix + "> "));
      i = next - 1;
      continue;
    }
    if (CHECK.test(unquote(line))) {
      out.push("", "> " + unquote(line));
      let j = i + 1;
      for (; j < blocks.length; j++) {
        const l = blocks[j] ?? "";
        const bare = unquote(l);
        if (TROUBLE.test(bare) || /^#{1,6}\s/.test(bare)) break;
        if (LABEL.test(bare)) {
          const { rows, next } = takeTableFrom(blocks, j + 1);
          if (rows.length) out.push(...panel(rows, "> > "));
          j = next - 1;
          continue;
        }
        if (bare.trim() === "") {
          // a blank line ends the check when a numbered step or heading follows
          const next = unquote(blocks[j + 1] ?? "");
          if (/^(\d+\.\s|#{1,6}\s)/.test(next) || next.trim() === "") break;
          out.push(">");
          continue;
        }
        out.push("> " + bare);
      }
      out.push("");
      i = j - 1;
      continue;
    }
    if (TROUBLE.test(unquote(line))) {
      out.push("", "> **Troubleshooting**", ">");
      let j = i + 1;
      while (j < blocks.length && (blocks[j] ?? "").trim() === "") j++;
      while (j < blocks.length && /^(?:\s*>)*\s*[-*]\s+/.test(blocks[j] ?? "")) {
        out.push("> " + unquote(blocks[j] ?? ""));
        j++;
      }
      out.push("");
      i = j - 1;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : "Copy to clipboard"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // a blocked clipboard: the text is still selectable
        }
      }}
      className={
        "shrink-0 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground " +
        className
      }
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

/** The block's text for display: a tail of one or two characters (a lone
 * "." or "-f") is glued to the word before it, so it never wraps alone. */
function keepTails(node: ReactNode): ReactNode {
  if (typeof node === "string") return node.replace(/ (\S{1,2})(?=\n|$)/g, "\u00a0$1");
  if (Array.isArray(node)) return node.map(keepTails);
  if (isValidElement<{ children?: ReactNode }>(node))
    return { ...node, props: { ...node.props, children: keepTails(node.props.children) } };
  return node;
}

function CommandBlock({ text, children }: { text: string; children: ReactNode }) {
  children = keepTails(children);
  return (
    <div className="relative mt-4 border-2 border-ink">
      <pre
        tabIndex={0}
        className="whitespace-pre-wrap bg-code p-4 pt-10 font-mono text-sm text-on-dark [overflow-wrap:anywhere] sm:pt-4 sm:pr-20"
      >
        {children}
      </pre>
      <CopyButton
        text={text.replace(/\n$/, "")}
        className="absolute right-2 top-2 border-2 border-ink bg-card px-2 py-1 text-foreground"
      />
    </div>
  );
}

/** The "What am I typing?" table the setup guide carries under a command
 * block, folded under a bar; open, it is the document's own table. */
function TypingPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const rest = Children.toArray(children)
    .filter((c) => isValidElement(c))
    .slice(1);
  return (
    <div
      data-panel
      className="-mt-[2px] border-2 border-ink bg-card shadow-hard-sm [&_div[role=region]]:mt-0 [&_div[role=region]]:border-0 [&_div[role=region]]:shadow-none [&_td:first-child]:min-w-[15rem] [&_td:first-child]:max-w-[22rem] [&_td:first-child]:font-mono [&_td:first-child]:text-xs [&_td:first-child]:whitespace-pre-wrap [&_td:first-child]:[overflow-wrap:anywhere] [&_td:first-child_code]:bg-transparent [&_td:first-child_code]:p-0 [&_td:first-child_code]:text-xs [&_td:first-child_strong]:font-normal [&_td:last-child]:font-mono [&_td:last-child]:text-[0.65rem] [&_td:last-child]:uppercase [&_td:last-child]:tracking-widest [&_td:last-child]:text-muted-foreground [&_td:last-child]:whitespace-nowrap [&_td:last-child]:w-[1%] [&_td:nth-child(2)_code]:bg-transparent [&_td:nth-child(2)_code]:px-0 [&_td:last-child_code]:bg-transparent [&_td:last-child_code]:p-0 [&_td:last-child_code]:text-[0.65rem] [&_th]:text-[0.6rem]"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-xs font-bold uppercase tracking-widest hover:bg-secondary"
      >
        <span>What am I typing?</span>
        <span aria-hidden="true">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <div className="border-t-2 border-ink">{rest}</div>}
    </div>
  );
}

/** True inside a Troubleshooting box: its list folds, item by item. */
const TroubleCtx = createContext(false);

/** One Troubleshooting item, folded: the problem (the item's italic lead) is
 * the row a reader scans; the fix opens under it. An item with no italic
 * lead stays a plain line. */
function TroubleItem({ children }: { children: ReactNode }) {
  const parts = Children.toArray(children);
  const i = parts.findIndex((p) => isValidElement(p) && p.type === "em");
  if (i < 0) return <div className="mt-2 leading-relaxed">{children}</div>;
  const problem = parts[i] as ReactElement<{ children?: ReactNode }>;
  const fix = parts.slice(i + 1);
  return (
    <details className="group border-t border-ink/20 first:border-t-0">
      <summary className="flex cursor-pointer list-none items-start gap-2 py-1.5 leading-relaxed hover:bg-secondary/60 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="mt-px w-3 shrink-0 font-mono text-xs font-bold">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">{"\u2212"}</span>
        </span>
        <span className="italic">{problem.props.children}</span>
      </summary>
      <div className="pb-2 pl-5 leading-relaxed">{fix}</div>
    </details>
  );
}

export function ProjectMarkdown({
  id,
  markdown,
  platform,
}: {
  id: string;
  markdown: string;
  platform?: Platform | undefined;
}) {
  // Headings carry ids so the page's "On this page" list can jump to them.
  // The allocator numbers repeats in document order; it is rebuilt on every
  // render, and the Markdown renders in one pass, so the ids stay stable.
  const nextId = makeIdAllocator();
  const anchor = (children: ReactNode) => nextId(textOf(children).trim());
  const components: Components = {
    h1: ({ children }) => (
      <h1
        id={anchor(children)}
        tabIndex={-1}
        className="mt-10 scroll-mt-24 text-3xl font-bold uppercase tracking-tighter first:mt-0 sm:text-4xl"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        id={anchor(children)}
        tabIndex={-1}
        className="mt-10 scroll-mt-24 border-b-4 border-ink pb-2 text-2xl font-bold uppercase tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={anchor(children)}
        tabIndex={-1}
        className="mt-8 scroll-mt-24 text-lg font-bold uppercase tracking-tight"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        id={anchor(children)}
        tabIndex={-1}
        className="mt-6 scroll-mt-24 text-base font-bold uppercase tracking-tight"
      >
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5
        id={anchor(children)}
        tabIndex={-1}
        className="mt-4 scroll-mt-24 text-sm font-bold uppercase tracking-widest"
      >
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        id={anchor(children)}
        tabIndex={-1}
        className="mt-4 scroll-mt-24 font-mono text-xs font-bold uppercase tracking-widest"
      >
        {children}
      </h6>
    ),
    p: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
    ul: ({ children }) =>
      useContext(TroubleCtx) ? (
        <div className="mt-2">{children}</div>
      ) : (
        <ul className="mt-4 list-disc space-y-1.5 pl-6">{children}</ul>
      ),
    ol: ({ children, start }) => (
      <ol start={start} className="mt-4 list-decimal space-y-1.5 pl-6">
        {children}
      </ol>
    ),
    li: ({ children }) =>
      useContext(TroubleCtx) ? (
        <TroubleItem>{children}</TroubleItem>
      ) : (
        <li className="leading-relaxed">{children}</li>
      ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    a: ({ href, children }) => {
      const r = resolveLink(id, href ?? "");
      const cls =
        "font-semibold text-primary underline decoration-2 underline-offset-2 hover:decoration-4";
      if (r.to) {
        return (
          <Link to={r.to} className={cls}>
            {children}
          </Link>
        );
      }
      const external = /^https?:/.test(r.href ?? "");
      return (
        <a
          href={r.href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
          {external && <NewTab arrow={false} />}
        </a>
      );
    },
    img: ({ src, alt }) => (
      <img
        src={imageSrc(id, String(src ?? ""))}
        alt={alt ?? ""}
        loading="lazy"
        className="mt-6 max-w-full border-2 border-ink shadow-hard-sm"
      />
    ),
    code: ({ children, className }) => {
      return className ? (
        <code className={className}>{children}</code>
      ) : (
        <code className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[0.9em]">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <CommandBlock text={textOf(children)}>{children}</CommandBlock>,
    blockquote: ({ children }) => {
      // the Docs export writes indented steps as quotes: plain indentation here,
      // except the Check box and the Troubleshooting box
      const first = Children.toArray(children).find((c) => isValidElement(c));
      const label = textOf(first).trim().split(/\s/)[0] ?? "";
      if (textOf(first).trim() === "What am I typing?")
        return <TypingPanel>{children}</TypingPanel>;
      if (label === "Check." || label === "Check:") {
        return (
          <div className="mt-5 border-2 border-ink border-l-8 border-l-primary bg-card p-3 pt-0 shadow-hard-sm [&>*:not([data-panel])]:mt-3">
            {children}
          </div>
        );
      }
      if (textOf(first).trimStart().startsWith("\u2063")) {
        return (
          <div className="mt-4 border-2 border-ink border-l-8 border-l-ink bg-secondary p-3 pt-0 shadow-hard-sm [&>p]:mt-3 [&_code]:bg-card">
            {children}
          </div>
        );
      }
      if (label === "Troubleshooting") {
        // each item folds: the problem (the italic lead) is the row, the fix
        // opens under it; the list and its items read the context below
        return (
          <TroubleCtx.Provider value={true}>
            <div className="mt-4 border-2 border-ink border-l-8 border-l-gold bg-card p-3 pt-0 shadow-hard-sm [&>p]:mt-3">
              {children}
            </div>
          </TroubleCtx.Provider>
        );
      }
      return <div className="mt-1">{children}</div>;
    },
    hr: () => <hr className="my-10 border-t-4 border-ink" />,
    table: ({ children }) => (
      <div
        role="region"
        aria-label="Table"
        tabIndex={0}
        className="mt-6 overflow-x-auto border-2 border-ink shadow-hard-sm"
      >
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b-2 border-ink bg-secondary px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-widest">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-ink/30 px-3 py-2 align-top">{children}</td>
    ),
  };
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markCommands(markdown, platform)}
    </ReactMarkdown>
  );
}
