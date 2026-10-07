import { Link } from "@tanstack/react-router";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { imageSrc, resolveLink } from "@/lib/published";

// A project document, rendered in this site's own type and colors. The
// Markdown comes from the published repository; every style below is a
// site token, so a theme change here restyles the handouts with it.

export function ProjectMarkdown({ id, markdown }: { id: string; markdown: string }) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mt-10 text-3xl font-bold uppercase tracking-tighter first:mt-0 sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 border-b-4 border-ink pb-2 text-2xl font-bold uppercase tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-lg font-bold uppercase tracking-tight">{children}</h3>
    ),
    p: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="mt-4 list-disc space-y-1.5 pl-6">{children}</ul>,
    ol: ({ children }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
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
    code: ({ children, className }) =>
      className ? (
        <code className={className}>{children}</code>
      ) : (
        <code className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[0.9em]">
          {children}
        </code>
      ),
    pre: ({ children }) => (
      <pre className="mt-4 overflow-x-auto border-2 border-ink bg-code p-4 font-mono text-sm text-on-dark shadow-hard-sm">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-ink pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-t-4 border-ink" />,
    table: ({ children }) => (
      <div className="mt-6 overflow-x-auto border-2 border-ink shadow-hard-sm">
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
      {markdown}
    </ReactMarkdown>
  );
}
