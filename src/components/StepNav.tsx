import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Section } from "@/lib/sections";

// The step sidebar and the Previous / Next pager for a document read one
// step at a time. Both are built from the document's own headings.

const item =
  "block w-full border-2 px-3 py-1.5 text-left text-sm leading-snug transition-transform hover:-translate-y-0.5";

export function StepSidebar({
  sections,
  index,
  onPick,
}: {
  sections: Section[];
  index: number;
  onPick: (i: number) => void;
}) {
  let lastGroup: string | undefined;
  return (
    <nav aria-label="Steps" className="lg:sticky lg:top-24">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Steps
      </p>
      <ol className="mt-2 space-y-1.5">
        {sections.map((s, i) => {
          const label = s.group !== lastGroup ? s.group : undefined;
          lastGroup = s.group;
          const active = i === index;
          return (
            <li key={s.id}>
              {label && (
                <p className="mt-4 mb-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
              )}
              <a
                href={`#${s.id}`}
                aria-current={active ? "step" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onPick(i);
                }}
                className={
                  item +
                  " " +
                  (active
                    ? "border-ink bg-primary font-bold text-primary-foreground shadow-hard-sm"
                    : "border-transparent hover:border-ink hover:bg-secondary")
                }
              >
                {s.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const pager =
  "inline-flex max-w-[48%] items-center gap-2 border-2 border-ink bg-card px-3 py-2 text-left text-sm font-bold shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:bg-secondary";

export function StepPager({
  sections,
  index,
  onPick,
}: {
  sections: Section[];
  index: number;
  onPick: (i: number) => void;
}) {
  const prev = index > 0 ? sections[index - 1] : undefined;
  const next = index < sections.length - 1 ? sections[index + 1] : undefined;
  return (
    <nav
      aria-label="Previous and next step"
      className="mt-12 flex justify-between gap-4 border-t-4 border-ink pt-6"
    >
      {prev ? (
        <a
          href={`#${prev.id}`}
          onClick={(e) => {
            e.preventDefault();
            onPick(index - 1);
          }}
          className={pager}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>
            <span className="block font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Previous
            </span>
            {prev.title}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={`#${next.id}`}
          onClick={(e) => {
            e.preventDefault();
            onPick(index + 1);
          }}
          className={pager + " ml-auto text-right"}
        >
          <span>
            <span className="block font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Next
            </span>
            {next.title}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
