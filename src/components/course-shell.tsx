import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLink =
  "font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary";

export function CourseHeader() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-4 px-6 py-3">
        <nav aria-label="Course navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/" className={navLink}>About</Link>
          <Link to="/" hash="syllabus" className={navLink}>Schedule</Link>
          <Link to="/lectures" className={navLink}>Lectures</Link>
          <Link to="/projects" className={navLink}>Projects</Link>
          <Link to="/" hash="team" className={navLink}>Staff</Link>
          <a href="https://canvas.uw.edu/courses/1916846" target="_blank" rel="noreferrer" className={navLink}>Canvas</a>
          <a href="https://edstem.org/us/courses/107539/discussion" target="_blank" rel="noreferrer" className={navLink}>Ed</a>
          <Link
            to="/projects"
            className="border-2 border-ink bg-gold px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
          >
            Project 1 is live
          </Link>
        </nav>
      </div>
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
    <footer id="team" className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="inline-block border-2 border-ink bg-card px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-hard-sm">
          Staff
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tighter sm:text-4xl">
          The team
        </h2>
        <div className="mt-8 border-2 border-ink bg-card shadow-hard">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink px-5 py-3">
            <span className="font-bold">Steve Seitz — Professor</span>
            <a
              href="mailto:seitz@cs.washington.edu"
              className="font-mono text-sm text-primary underline underline-offset-4 hover:no-underline"
            >
              seitz@cs.washington.edu
            </a>
          </div>
          <ul className="divide-y-2 divide-ink">
            {tas.map((ta) => (
              <li key={ta.email} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
                <span className="font-bold">{ta.name}</span>
                <a
                  href={`mailto:${ta.email}`}
                  className="font-mono text-sm text-primary underline underline-offset-4 hover:no-underline"
                >
                  {ta.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-6 py-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span>University of Washington · CSE 490 A2</span>
          <span>Autumn 2026</span>
        </div>
      </div>
    </footer>
  );
}

export function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-primary selection:text-primary-foreground">
      <CourseHeader />
      {children}
      <CourseFooter />
    </div>
  );
}
