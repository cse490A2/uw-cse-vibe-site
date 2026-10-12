// The UW LLM proxy only answers from the UW network, so off-campus work
// needs the UW VPN. Shown above every page of the projects that use it.
export const PROXY_PROJECTS = new Set(["P02", "P03"]);

const VPN_ARTICLE = "https://uwconnect.uw.edu/it?id=kb_article_view&sysparm_article=KB0034243";

export function VpnNotice({ className = "" }: { className?: string }) {
  return (
    <div className={"border-2 border-ink bg-gold p-4 text-gold-foreground shadow-hard-sm " + className}>
      <p className="font-mono text-xs font-bold uppercase tracking-widest">
        Working off campus? Use the UW VPN
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        The course LLM proxy (<code>llmproxy.cs.washington.edu</code>) is only reachable from the
        UW network. Off campus without UW Wi-Fi, requests fail with an httpx traceback ending in{" "}
        <code>nodename nor servname provided</code> or <code>openai.APIConnectionError</code>.
        Connect to the{" "}
        <a href={VPN_ARTICLE} className="font-semibold underline" target="_blank" rel="noreferrer">
          UW VPN
        </a>{" "}
        and try again.
      </p>
    </div>
  );
}
