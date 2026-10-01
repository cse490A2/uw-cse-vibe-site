import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navClass = "border-r-4 border-ink px-4 py-3 text-sm font-bold uppercase transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:outline-none";

export function CourseHeader() {
  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 py-7">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">University of Washington · Paul G. Allen School</p>
          <Link to="/" aria-label="Vibe Coding home" className="block font-display text-6xl leading-[0.85] uppercase sm:text-7xl">Vibe<br />Coding</Link>
        </div>
        <div className="text-left text-sm font-bold uppercase leading-6 sm:text-right">
          <p className="text-primary">CSE 490 A2 · 2 credits</p>
          <p>Thu 10:00–11:20 · Savery 260</p>
        </div>
      </div>
      <nav aria-label="Course navigation" className="border-t-4 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap px-5">
          <Link to="/" className={navClass}>Overview</Link>
          <Link to="/lectures" className={navClass}>Lectures</Link>
          <Link to="/projects" className={navClass}>Projects</Link>
          <Link to="/" hash="resources" className={navClass}>Resources</Link>
          <Link to="/" hash="team" className={navClass}>Team</Link>
        </div>
      </nav>
    </header>
  );
}

export function CourseFooter() {
  return (
    <footer id="team" className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-9 px-5 py-12 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Instructional team</p>
          <ul className="space-y-1 text-sm font-bold">
            <li>Steve Seitz — Professor · seitz@cs.washington.edu</li>
            <li>Vinamra Agarwal · Ella Cao</li>
            <li>Prabhgun Basi · Arian Shamaei · Aditya Kumar</li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Next class</p>
          <p className="font-display text-3xl leading-none uppercase">Thursday 10:00<br />Savery 260</p>
          <p className="mt-4 text-sm font-bold">Bring a laptop. We’re building.</p>
        </div>
      </div>
      <div className="border-t-4 border-gold">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest">
          <span>University of Washington · CSE 490 A2</span><span>Built for the web · Ready for GitHub Pages</span>
        </div>
      </div>
    </footer>
  );
}

export function CourseLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-paper font-mono text-ink selection:bg-primary selection:text-primary-foreground"><CourseHeader />{children}<CourseFooter /></div>;
}