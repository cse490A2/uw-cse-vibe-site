import { PLATFORMS, PLATFORM_LABEL, type Heading, type Platform } from "@/lib/platform";

// The panel above a long project document: a button per computer the
// document covers, and the document's headings as links. Both come from the
// Markdown itself, so a new project gets them without a change here.

const button =
  "border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm transition-transform hover:-translate-y-0.5";

export function PlatformPicker({
  platforms,
  value,
  onChange,
}: {
  platforms: Platform[];
  value: Platform;
  onChange: (p: Platform) => void;
}) {
  const shown = PLATFORMS.filter((p) => platforms.includes(p));
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Your computer
      </span>
      {shown.map((p) => (
        <button
          key={p}
          type="button"
          aria-pressed={p === value}
          onClick={() => onChange(p)}
          className={
            button +
            " " +
            (p === value ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")
          }
        >
          {PLATFORM_LABEL[p]}
        </button>
      ))}
    </div>
  );
}

// A short handout needs no list; a setup guide with a dozen steps does.
const MIN_ITEMS = 6;

const INDENT: Record<number, string> = { 2: "", 3: "pl-4", 4: "pl-8", 5: "pl-12", 6: "pl-16" };

export function OnThisPage({ items }: { items: Heading[] }) {
  if (items.length < MIN_ITEMS) return null;
  const jump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };
  return (
    <nav aria-label="On this page">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ol className="mt-2 columns-1 gap-x-8 text-sm sm:columns-2">
        {items.map((h) => (
          <li key={h.id} className={"break-inside-avoid py-0.5 " + (INDENT[h.level] ?? "")}>
            <a
              href={`#${h.id}`}
              onClick={jump(h.id)}
              className={
                h.level === 2
                  ? "font-bold uppercase tracking-tight text-foreground hover:text-primary hover:underline"
                  : "text-foreground/85 hover:text-primary hover:underline"
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageGuide({
  platforms,
  platform,
  onPlatform,
  items,
}: {
  platforms: Platform[];
  platform: Platform;
  onPlatform: (p: Platform) => void;
  items: Heading[];
}) {
  const pick = platforms.length >= 2;
  const list = items.length >= MIN_ITEMS;
  if (!pick && !list) return null;
  return (
    <div className="mt-8 border-2 border-ink bg-card p-4 shadow-hard-sm">
      {pick && <PlatformPicker platforms={platforms} value={platform} onChange={onPlatform} />}
      {pick && list && <hr className="my-4 border-t-2 border-ink/30" />}
      {list && <OnThisPage items={items} />}
    </div>
  );
}
