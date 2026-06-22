# Portfolio UI Kit — 明听影思 写作作品集

A writing portfolio for the WeChat public account **《明听影思》**. The whole
site is organised around two essay series — **到达 (Arrival)** and
**自由戏 (Free Play)** — presented as hoverable "文件袋 / 卡片" that scale up,
hint that they're clickable, and open a preview of the article's body + 金句.
A giant rotating 金句 is the hero; oversized pull-quotes drift in parallax
between sections. (Source account: 《明听影思》on WeChat; profile repo
github.com/yaobi07/yaobiprofile.)

## Two directions (the deliverable)
- `index.html` — **方向对比**: directions A and B shown side by side in scaled
  iframes, each with an "打开 ↗" link. Load this to choose.
- `DirectionA.html` — **纸感档案**: warm paper, tilted file-folder cards with
  series tabs, light parallax pull-quotes. Calmer, archival.
- `DirectionB.html` — **金句剧场**: a color-slab hero stage (terracotta /
  cobalt / ink rotating), numbered large-format editorial plates, and
  full-bleed dark 金句 bands. Bolder, dramatic scale.

Both directions share the same content and the same core interaction:
hover a card → it scales + reveals a "点击预览 →" hint → click → modal with
cover, 金句, excerpt, tags, and a "在公众号阅读全文" link out to WeChat.

## Files
- `content.js` — all copy on `window.YAOBI`: brand, `hero` 金句 list, and the
  two `series` with their articles (title / quote / excerpt / cover / tags /
  WeChat href). Articles still awaiting a title/金句 are `needsContent:true`
  and render as a sealed "点击阅读原文" folder that links straight to WeChat.
- `DirectionA.html`, `DirectionB.html` — the two self-contained directions.
- `index.html` — the side-by-side comparison shell.
- `CursorTrail.jsx` — the ink-red pen cursor trail (canvas, multiply blend),
  shared by both directions.

## Brand details preserved
- Editorial serif (Noto Serif SC) for every headline + 金句.
- Saturated terracotta `--accent-hot` + bold `--cobalt` second color; `--acid`
  pop on B's merit button.
- Pen-nib cursor (`--ys-cursor`) and the ink-red pointer trail.
- 功德+1 merit easter egg (kept in both directions).
- Warm-paper background; `--ink-night` for B's dramatic quote bands.

## Pending content
Five 到达 + one 自由戏 article have no title/金句 yet (WeChat could not be
fetched). They appear as sealed folders that link out. Send titles + 金句 and
they'll fill in as full preview cards.
