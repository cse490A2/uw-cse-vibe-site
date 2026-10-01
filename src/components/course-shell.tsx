import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navClass = "border-r-4 border-ink px-4 py-3 text-sm font-bold uppercase transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:outline-none";

export function CourseHeader({ isHome = false }: { isHome?: boolean }) {
  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 py-7">
        <div>
          {isHome ? <h1 className="font-display text-6xl leading-[0.85] uppercase sm:text-7xl">Vibe<br />Coding</h1> : <Link to="/" aria-label="Vibe Coding home" className="block font-display text-6xl leading-[0.85] uppercase sm:text-7xl">Vibe<br />Coding</Link>}
        </div>
        <div className="text-left text-sm font-bold uppercase leading-6 sm:text-right">
          <p className="text-primary">CSE 490 A2 · 2 credits</p>
          <p>Thu 10:00–11:20 · Savery 260</p>
          <p className="text-primary">University of Washington · Paul G. Allen School</p>
          <p className="mt-3">Steve Seitz — Professor · seitz@cs.washington.edu</p>
        </div>
      </div>
      <nav aria-label="Course navigation" className="border-t-4 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap px-5">
          <Link to="/" className={navClass}>Overview</Link>
          <Link to="/lectures" className={navClass}>Lectures</Link>
          <Link to="/projects" className={navClass}>Projects</Link>
          <Link to="/" hash="team" className={navClass}>Team</Link>
          <a href="https://canvas.uw.edu/courses/1916846" target="_blank" rel="noreferrer" className={navClass}>Canvas</a>
          <a href="https://edstem.org/us/courses/107539/discussion" target="_blank" rel="noreferrer" className={navClass}>Ed Discussion</a>
        </div>
      </nav>
    </header>
  );
}

const tas = [
  { name: "Vinamra Agarwal", email: "vinamra1@cs.washington.edu" },
  { name: "Ella Cao", email: "ellacao@cs.washington.edu" },
  { name: "Prabhgun Basi", email: "basip@cs.washington.edu" },
  { name: "Arian Shamaei", email: "ashama@uw.edu" },
  { name: "Aditya Kumar", email: "adikum26@cs.washington.edu" },
];

export function CourseFooter() {
  return (
    <footer id="team" className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="font-display text-3xl uppercase text-gold">Team</h2>
        <p className="mt-4 text-sm font-bold uppercase">Steve Seitz — Professor · <a href="mailto:seitz@cs.washington.edu" className="border-b-2 border-gold text-gold transition-colors hover:bg-gold hover:text-ink">seitz@cs.washington.edu</a></p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold uppercase">
          {tas.map((ta) => (
            <li key={ta.email}>{ta.name} · <a href={`mailto:${ta.email}`} className="border-b-2 border-gold text-gold transition-colors hover:bg-gold hover:text-ink">{ta.email}</a></li>
          ))}
        </ul>
      </div>
      <div className="border-t-4 border-gold">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest">
          <span>University of Washington · CSE 490 A2</span>
        </div>
      </div>
    </footer>
  );
}

export function CourseLayout({ children, isHome = false }: { children: ReactNode; isHome?: boolean }) {
  return <div className="min-h-screen bg-paper font-mono text-ink selection:bg-primary selection:text-primary-foreground"><CourseHeader isHome={isHome} />{children}<CourseFooter /></div>;
}