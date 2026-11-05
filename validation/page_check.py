#!/usr/bin/env python3
"""The project page's layout rules, proved on every step for every computer,
with computer vision on the captures (the course's layout-check idea, owner
direction 2026-10-11: general rules that persist regardless of asset change,
with cv validation), here for the site's setup page.

    python3 validation/page_check.py [--url http://127.0.0.1:5177/projects/P06/setup] [--out validation/out]

For every (computer, step) at 1280 px, and for step 1 at phone width (390 px):
opens the page, picks the computer, opens the step and every "What am I
typing?" panel, measures the DOM and screenshots the page; then proves:
  R1  no sideways scroll: the document is no wider than the window.
  R2  everything in the article stays inside the article's box.
  R3  a command block hides nothing: no inner scroll, and its text ends
      before the Copy button.
  R4  no orphan: a wrapped command line never leaves fewer than three
      characters on a line of its own.
  R5  the typing panel sits flush under its block (no gap, no overlap) and
      shares its left edge and width.
  R6  a panel's table is whole: three cells a row, a first cell with text,
      no clipped cell.
  R7  a Check box holds a command or a sentence; a Troubleshooting box holds
      folded items, each closed with a problem on its row.
  R8  the sidebar lights the step shown (its text is the page title), and
      Previous / Next name the neighbours.
  R9  a numbered list that a command block interrupts resumes its count.
  R10 every picture loaded (a warning: the local preview has no images).
  R11 (cv) the gutter right of the article is clean: no ink past the edge.
  P1  at phone width: R1 to R3, and the sidebar stacks above the article.
Writes <out>/<computer>-<step>.png, <out>/contact.png and <out>/report.md.
Exit 1 on any break, else 0."""
import argparse, asyncio, json, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright

MEASURE = r"""
() => {
  const art = document.querySelector('article');
  const A = art.getBoundingClientRect();
  const out = {inner: innerWidth, scrollW: document.documentElement.scrollWidth,
               article: {l:A.left, r:A.right, t:A.top+scrollY, b:A.bottom+scrollY},
               outside: [], pres: [], panels: [], tables: [], boxes: [], ols: [], imgs: [],
               sidebar: null, pager: null, h1: (art.querySelector('h1')||{}).textContent||'',
               header: null, aside: null};
  const hdr = document.querySelector('header'); if (hdr) { const H = hdr.getBoundingClientRect(); out.header = {t:H.top, b:H.bottom, sticky: getComputedStyle(hdr).position}; }
  const aside = document.querySelector('aside'); if (aside) { const S = aside.getBoundingClientRect(); out.aside = {t:S.top+scrollY, b:S.bottom+scrollY, l:S.left, r:S.right}; }
  for (const el of art.querySelectorAll('*')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (r.right > A.right + 1 || r.left < A.left - 1) out.outside.push({tag: el.tagName, cls: (el.className||'').toString().slice(0,40), l:r.left, r:r.right, text:(el.textContent||'').trim().slice(0,40)});
  }
  for (const pre of art.querySelectorAll('pre')) {
    const r = pre.getBoundingClientRect();
    const btn = pre.parentElement.querySelector('button');
    const B = btn ? btn.getBoundingClientRect() : null;
    const range = document.createRange(); range.selectNodeContents(pre);
    const rects = [...range.getClientRects()].filter(x => x.width > 0);
    const fs = parseFloat(getComputedStyle(pre).fontSize);
    const maxRight = Math.max(...rects.map(x => x.right), 0);
    const underBtn = B ? rects.some(x => x.right > B.left - 4 && x.left < B.right && x.bottom > B.top && x.top < B.bottom) : false;
    // an orphan: a source line that wraps and leaves fewer than three characters alone
    let orphan = false;
    const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
    for (let tn = walker.nextNode(); tn; tn = walker.nextNode()) {
      const s = tn.textContent; let start = 0;
      for (const part of s.split('\n')) {
        const end = start + part.length;
        if (part.trim()) {
          const rg = document.createRange(); rg.setStart(tn, start); rg.setEnd(tn, end);
          const rr = [...rg.getClientRects()].filter(x => x.width > 0);
          const tops = [...new Set(rr.map(x => Math.round(x.top)))];
          if (tops.length > 1) {
            const last = rr.filter(x => Math.round(x.top) === tops[tops.length-1]).reduce((w, x) => w + x.width, 0);
            if (last < 3 * 0.6 * fs) orphan = true;
          }
        }
        start = end + 1;
      }
    }
    out.pres.push({scrollW: pre.scrollWidth, clientW: pre.clientWidth, maxRight, underBtn, btnLeft: B ? B.left : null, fs,
                   orphan, top: r.top+scrollY, bottom: r.bottom+scrollY, text: pre.textContent.slice(0,50)});
  }
  for (const btn of art.querySelectorAll('button[aria-expanded]')) {
    const panel = btn.closest('div.shadow-hard-sm'); if (!panel) continue;
    const P = panel.getBoundingClientRect();
    const blk = panel.previousElementSibling; const K = blk ? blk.getBoundingClientRect() : null;
    const tbl = panel.querySelector('table');
    const rows = tbl ? [...tbl.querySelectorAll('tr')].map(tr => ({cells: tr.children.length, first: (tr.children[0]||{}).textContent||'', clipped: [...tr.children].some(td => td.scrollWidth > td.clientWidth + 1)})) : [];
    out.panels.push({gap: K ? P.top - K.bottom : null, dl: K ? P.left - K.left : 0, dw: K ? P.width - K.width : 0, open: btn.getAttribute('aria-expanded') === 'true', rows, hasTable: !!tbl, top: P.top+scrollY});
  }
  for (const box of art.querySelectorAll('div.border-l-primary, div.border-l-gold')) {
    const kind = box.className.includes('border-l-primary') ? 'check' : 'trouble';
    const folds = [...box.querySelectorAll('details')].map(d => ({problem: ((d.querySelector('summary')||{}).textContent||'').trim().length, open: d.open}));
    out.boxes.push({kind, hasPre: !!box.querySelector('pre'), hasText: (box.textContent||'').trim().length > 20, hasList: !!box.querySelector('ul'), folds});
  }
  const kids = [...art.querySelectorAll('ol, h1, h2, h3, h4')];
  out.ols = kids.map(el => el.tagName === 'OL' ? {start: parseInt(el.getAttribute('start')||'1'), n: el.children.length} : {heading: true});
  for (const img of art.querySelectorAll('img')) out.imgs.push({ok: img.naturalWidth > 0, src: img.getAttribute('src')});
  const nav = document.querySelector('nav[aria-label=Steps]');
  if (nav) { const items = [...nav.querySelectorAll('a')].map(a => a.textContent.trim()); const cur = nav.querySelector('[aria-current=step]'); out.sidebar = {items, current: cur ? cur.textContent.trim() : null, count: nav.querySelectorAll('[aria-current=step]').length}; }
  const pg = document.querySelector('nav[aria-label="Previous and next step"]');
  if (pg) { const links = [...pg.querySelectorAll('a')]; out.pager = links.map(a => ({label: a.querySelector('span span').textContent.trim(), title: a.textContent.replace(/Previous|Next/,'').trim()})); }
  return out;
}
"""

def norm(s): return " ".join(s.replace("−","").split()).lower()

def rules(m, width, pixels, phone=False):
    breaks, warns = [], []
    art = m["article"]
    if m["scrollW"] > m["inner"] + 1: breaks.append("R1 document %d px wide in a %d px window" % (m["scrollW"], m["inner"]))
    for o in m["outside"][:5]: breaks.append("R2 <%s> %s reaches %.0f past the article (%.0f): %r" % (o["tag"], o["cls"], o["r"], art["r"], o["text"]))
    for p in m["pres"]:
        if p["scrollW"] > p["clientW"] + 1: breaks.append("R3 block scrolls inside: %r" % p["text"])
        if p["underBtn"]: breaks.append("R3 text runs under Copy: %r" % p["text"])
        if p["orphan"]: breaks.append("R4 orphan fragment in block: %r" % p["text"])
    if phone:
        if m["aside"] and m["aside"]["b"] > art["t"] + 1: breaks.append("P1 sidebar overlaps the article at phone width")
        return breaks, warns
    for p in m["panels"]:
        if p["gap"] is None or not (-3 <= p["gap"] <= 1): breaks.append("R5 panel gap %.1f px" % (p["gap"] if p["gap"] is not None else -99))
        if abs(p["dl"]) > 1 or abs(p["dw"]) > 1: breaks.append("R5 panel offset %.0f px, width differs by %.0f px from its block" % (p["dl"], p["dw"]))
        if p["open"]:
            if not p["hasTable"]: breaks.append("R6 open panel without a table")
            for r in p["rows"]:
                if r["cells"] != 3: breaks.append("R6 row with %d cells: %r" % (r["cells"], r["first"][:30]))
                if not r["first"].strip(): breaks.append("R6 row with an empty first cell")
                if r["clipped"]: breaks.append("R6 clipped cell in row %r" % r["first"][:30])
    for b in m["boxes"]:
        if b["kind"] == "check" and not (b["hasPre"] or b["hasText"]): breaks.append("R7 empty Check box")
        if b["kind"] == "trouble":
            folds = b.get("folds") or []
            if not folds: breaks.append("R7 Troubleshooting box without folded items")
            if any(f["problem"] < 4 for f in folds): breaks.append("R7 a fold with no problem on its row")
            if any(f["open"] for f in folds): breaks.append("R7 a fold open before the reader opens it")
    sb = m["sidebar"]
    if sb:
        if sb["count"] != 1: breaks.append("R8 %d lit sidebar items" % sb["count"])
        elif norm(sb["current"]) not in norm(m["h1"]) and norm(m["h1"]) not in norm(sb["current"]) and sb["current"] != "Overview":
            breaks.append("R8 lit item %r but page title %r" % (sb["current"], m["h1"]))
        if m["pager"] and sb["current"] in sb["items"]:
            i = sb["items"].index(sb["current"])
            for pg in m["pager"]:
                want = sb["items"][i-1] if pg["label"] == "Previous" else sb["items"][i+1] if i+1 < len(sb["items"]) else None
                if want is not None and norm(pg["title"]) != norm(want): breaks.append("R8 %s names %r, sidebar neighbour is %r" % (pg["label"], pg["title"], want))
    prev = None
    for o in m["ols"]:
        if o.get("heading"): prev = None; continue
        if prev and o["start"] != prev["start"] + prev["n"] and o["start"] != 1: breaks.append("R9 list resumes at %d after %d+%d" % (o["start"], prev["start"], prev["n"]))
        if prev and o["start"] == 1 and prev["start"] + prev["n"] > 1: breaks.append("R9 list restarts at 1 after %d items" % (prev["start"] + prev["n"] - 1))
        prev = o
    for im in m["imgs"]:
        if not im["ok"]: warns.append("R10 picture did not load: %s" % im["src"])
    # cv: the right gutter beside the article is background only
    img = pixels
    bg = img[5, 5].astype(int)
    x0, x1 = int(art["r"]) + 6, min(int(art["r"]) + 40, img.shape[1] - 1)
    if x1 > x0:
        band = img[int(art["t"]):int(min(art["b"], img.shape[0])), x0:x1].astype(int)
        ink = np.abs(band - bg).sum(axis=2) > 60
        if ink.mean() > 0.002: breaks.append("R11 ink in the right gutter: %.1f%% of the band" % (100 * ink.mean()))
    return breaks, warns

async def run(url, out):
    os.makedirs(out, exist_ok=True)
    report, shots = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        await pg.goto(url, wait_until="networkidle"); await pg.wait_for_timeout(800)
        for osn in ("Mac", "Windows", "Linux"):
            await pg.get_by_role("button", name=osn, exact=True).click(); await pg.wait_for_timeout(300)
            items = await pg.evaluate("() => [...document.querySelectorAll('nav[aria-label=Steps] a')].map(a => a.textContent.trim())")
            for title in items:
                await pg.get_by_role("link", name=title, exact=True).first.click(); await pg.wait_for_timeout(350)
                for btn in await pg.get_by_role("button", name="What am I typing?").all():
                    if await btn.get_attribute("aria-expanded") != "true": await btn.click()
                await pg.wait_for_timeout(250)
                await pg.evaluate("() => scrollTo(0,0)")
                m = await pg.evaluate(MEASURE)
                slug = "%s-%s" % (osn.lower(), "".join(c if c.isalnum() else "-" for c in title.lower()).strip("-")[:32])
                path = os.path.join(out, slug + ".png")
                await pg.screenshot(path=path, full_page=True)
                pix = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2RGB)
                # R12: nothing under the sticky header but the header (the first viewport)
                breaks, warns = rules(m, 1280, pix)
                report.append((osn, title, breaks, warns)); shots.append((osn, title, path))
        # phone width, step 1, Mac
        ph = await b.new_page(viewport={"width": 390, "height": 844})
        await ph.goto(url + "#1-your-project-5-harness", wait_until="networkidle"); await ph.wait_for_timeout(800)
        await ph.evaluate("() => scrollTo(0,0)")
        m = await ph.evaluate(MEASURE)
        path = os.path.join(out, "phone-step1.png"); await ph.screenshot(path=path, full_page=True)
        pix = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2RGB)
        breaks, warns = rules(m, 390, pix, phone=True)
        report.append(("Phone", "1. Your Project 5 harness", breaks, warns)); shots.append(("Phone", "step 1", path))
        await b.close()
    # contact sheet: the top of every capture, thumbnails in a grid
    thumbs = []
    for osn, title, path in shots:
        im = Image.open(path).convert("RGB"); im = im.crop((0, 0, im.width, min(im.height, 1400))); im.thumbnail((300, 330))
        canvas = Image.new("RGB", (300, 350), "white"); canvas.paste(im, (0, 20))
        ImageDraw.Draw(canvas).text((4, 4), "%s / %s" % (osn, title[:34]), fill="black")
        thumbs.append(canvas)
    cols = 6; rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 304, rows * 354), "#ddd")
    for k, t in enumerate(thumbs): sheet.paste(t, ((k % cols) * 304 + 2, (k // cols) * 354 + 2))
    sheet.save(os.path.join(out, "contact.png"))
    lines = ["# Page check", "", "| computer | step | result |", "|---|---|---|"]
    nb = 0
    for osn, title, breaks, warns in report:
        nb += len(breaks)
        res = "PASS" if not breaks else "FAIL: " + "; ".join(breaks)
        if warns: res += " (warn: " + "; ".join(sorted(set(warns)))[:120] + ")"
        lines.append("| %s | %s | %s |" % (osn, title, res))
    lines += ["", "%d page(s), %d break(s)" % (len(report), nb)]
    open(os.path.join(out, "report.md"), "w").write("\n".join(lines) + "\n")
    print("\n".join(lines))
    return 1 if nb else 0

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--url", default="http://127.0.0.1:5177/projects/P06/setup"); ap.add_argument("--out", default="validation/out")
    a = ap.parse_args(); sys.exit(asyncio.run(run(a.url, a.out)))
