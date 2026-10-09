// The late policy, shown on the overview and the projects page from this
// one copy so the two never disagree.
export function LatePolicy({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
        Late policy
      </p>
      <div className="mt-8 border-2 border-ink bg-card p-6 shadow-hard md:max-w-xl">
        <p className="font-display text-4xl font-bold tracking-tighter text-primary">
          −25% / day
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Work turned in late without an excuse loses 25% of its credit
          for each day it is late.
        </p>
      </div>
    </div>
  );
}
