# Chrome design system

Tactile and pastel. The page is framed in soft pink, with full-width sections that
each have their own surface (fur, brushed metal, crumpled paper, glossy tiles).
Headlines are a liquid-chrome serif italic (2.jpeg). Every metal thing (keycaps,
paperclip, starburst, the small objects) shares that one chrome so it reads as one system.
References: `Unterlagen/Style-Reference/1–3.jpeg`.

```html
<link rel="stylesheet" href="_ds/chrome/styles.css">
```

Rolled out to all ten pages on 2026-10-14. It replaces Dopamine, which is archived in
`Backups/Dopamine Design-System (ersetzt 2026-10-14)/`.

## Every page needs the filter block

Chrome headings are lit by an inline SVG filter (`#chrome-lg`, `#chrome-sm`).
Chrome/Edge cannot reference a filter in another file, so the block lives in
each page. It is maintained in one place only, `Werkzeuge/kopf-fuss-abgleichen.py`.
Put the empty marker pair **after `</x-dc>`** (outside React, which would
otherwise re-render it) and run the script:

```html
</x-dc>
<!-- @chrome-defs -->
<!-- /@chrome-defs -->
```

Without the block, headings render without lighting and lose their contrast outline.

## Colour

| Token | Role | On `--color-bg` |
|---|---|---|
| `--color-bg` `#f7d8e6` | pastel pink base | — |
| `--color-bg-deep` | starbursts, deeper bands | — |
| `--color-surface` | paper, panels, polaroids | — |
| `--color-ink` | body text, outlines | 13 : 1 |
| `--color-ink-soft` | secondary text | 6.6 : 1 |
| `--color-accent` | links, kickers (lily magenta) | 5 : 1 |
| `--color-accent-soft` | fills (tear-off note). **Ink text only** | — |

Chrome: `--chrome-hi`, `--chrome-1…5`, `--chrome-blush`, plus the composites
`--chrome-stops`, `--chrome-text`, `--chrome-surface`, `--chrome-ring`, `--chrome-sheen`.
The **dark band** in the stops is what keeps chrome text above 3 : 1 on pink.
Never build a chrome gradient from the light stops alone.

## Type

| Family | Use | File |
|---|---|---|
| **Playfair Display Italic** (variable, `wght` 400–900) | `h1`, `h2`, `.chrome`, prices, the wordmark, nav brand. Always italic; 700 for headings, 800 for the wordmark | `fonts/playfair-display-italic-*.woff2` |
| **Archivo** (variable, `wght` 100–900, `wdth` 62–125) | body and UI at 100 %, labels and nav at `--stretch-label` (75 %) | `fonts/archivo-*.woff2` |
| **Instrument Serif Italic** | `.accent`, sparing: one phrase per block | `fonts/instrument-serif-italic-*.woff2` |

All are self-hosted (SIL OFL, licences in `fonts/`), so no font request goes to Google.

- `h1`, `h2` and `.chrome` are chrome **automatically**. Use `.chrome-sm` below about 48 px.
  Phones get `#chrome-sm` everywhere.
- `.plain` removes the chrome from a heading whose look comes from its content
  (keycaps, beads).
- `.vertical` is a bottom-to-top title (`writing-mode`; **never** add `transform: rotate`
  to an element that carries the filter, because Chrome then paints it black).
- `.mega` is the extra-large title size. `.kicker`, `.label`, `.lede`, `.accent` are
  the supporting styles. `.label-no` > `.num` gives "NO. 01 / CATEGORY".
- Chrome headings don't animate. Anything moving inside a filtered element re-runs
  the lighting every frame. Hover shine lives on buttons, keys and objects.
- Chrome text uses `--chrome-text` (built from `--chrome-text-stops`): a darker cut of
  the metal than the rings and keys, so the letters stay readable on pale panels.
- The home-page wordmark is live chrome text (an `h1`), not an image. The Modak
  bubble letters and their Blender wordmark render were retired on 2026-10-15.

### Rendered chrome headings

Chrome text is rendered in Blender, one image per word, so a heading still wraps
like text. Wrap the words, and only the words, in `<chrome-text>`:

```html
<h2><chrome-text>Ready for your next set?</chrome-text></h2>
<span class="svc-price chrome"><chrome-text>€80</chrome-text></span>
```

`chrome-text.js` (with `schrift/woerter.js`, both from the real `<head>`) swaps in the
images and sets `data-ready`; this stylesheet then turns the CSS chrome off on that
heading. Until every word of a heading has a render, it shows the CSS chrome instead.
Size still comes from the heading's `font-size`. Renders are made in
`Werkzeuge/chrome-assets/` (readme there); never edit `schrift/` by hand.

## Surfaces

```html
<section class="zone surface surface-metal scrim-start surface-edge">
  <picture class="surface-img">
    <source type="image/avif" srcset="_ds/chrome/tex/metall-800.avif 800w, _ds/chrome/tex/metall-1600.avif 1600w" sizes="100vw">
    <source type="image/webp" srcset="_ds/chrome/tex/metall-800.webp 800w, _ds/chrome/tex/metall-1600.webp 1600w" sizes="100vw">
    <img src="_ds/chrome/tex/metall-1600.webp" alt="" loading="lazy" decoding="async">
  </picture>
  <div class="wrap">…</div>
</section>
```

| Texture | Class | Files (`tex/`) | Text on it |
|---|---|---|---|
| Black-and-white fur | `.surface-fur` | `fell-800/1600/2400` | only inside `.panel` or `.tearoff` |
| Brushed metal | `.surface-metal` | `metall-800/1600` | ink, with `.scrim-start` |
| Crumpled paper | `.surface-paper` | `papier-800/1600` | ink directly |
| Glossy tiles | `.surface-tiles` | `fliesen-800/1600` | inside `.panel` |

`<picture>` rather than a CSS background, so the browser picks the width and format
and lazy-loads natively. Only the first screen's texture is eager (`fetchpriority="high"`).
Give consecutive sections different surfaces. Fur may come back as an accent.

## Components

| Class | Notes |
|---|---|
| `.btn` + `-primary` (ink) / `-chrome` / `-outline` / `-sm` / `-icon` / `-block` | Pill with a chrome ring. Hover sweeps a sheen across (transform only). |
| `.pill`, `.pill.accent`, `.pill-icon`, `.pills`, `.pills.on-surface` | Outlined pill tags. The ring is a masked `::after`, so they can be see-through. |
| `.marquee` > `.marquee-track` > `ul.pills` ×2 | The second list is `aria-hidden`. It pauses on hover and turns into a static wrapped row under reduced motion. |
| `.keycaps` > `.key`, `.keycaps.beads` | Letters as chrome keys or round beads. Put the word in `.sr-only` and add `aria-hidden` on `.keycaps`. Size via `--key-size`. |
| `.polaroid` + `.paperclip` + `figcaption` | Tilt via `--tilt`. |
| `.panel`, `.panel-pink` | Opaque reading surface with a chrome ring. No backdrop-filter. |
| `.burst` | Big soft starburst behind a section. Size and position in page CSS. |
| `.arrow-hand` | Inline SVG, paths with `pathLength="1"`. They draw themselves in on scroll. |
| `.steps` > `.step` | Numbered steps (see the process section on the home page). |
| `.tearoff` > `.tearoff-pin` + `.tearoff-body` + `ul.tearoff-strips` (`.is-torn`) | Contact note. The strips are links. |
| `.obj` + `.obj-float` / `-float-r` / `.parallax` / `-slow` | Blender chrome objects from `obj/`: `stern`, `funkeln`, `lilie`, `klammer`, `perle`. Always `alt=""` + `aria-hidden`. |
| `.photo`, `.washed` | `<image-slot>` compatibility. |
| `.nav…`, `.site-footer…` | Shared markup, synced by the script. |

## Page recipes (subpages)

Copy from the page named. None needs page CSS beyond positioning.

| Recipe | Markup | Example |
|---|---|---|
| Page header | `<header class="page-head zone">` > `.burst` + `img.obj.ph-a` + `img.obj.ph-b` + `.wrap` (`.kicker`, `h1`, optional `.lede`) | every subpage |
| Body on a surface | `<section class="zone surface surface-… surface-edge">` + `picture.surface-img` | every subpage |
| Section heading | `.section-head` > `.kicker` + `h2` + `.lede` | `services.dc.html` |
| Rules list | `<ol class="rules">` of `<li>`. `<sc-if>` around items is fine | `terms.dc.html` |
| Reading panel | `.card.paper.prose` (`h2` + `p` + `ul`; prose headings are plain Archivo) | `privacy.dc.html` |
| Key/value list | `<dl class="facts">` inside a reading panel | `imprint.dc.html` |
| Feature card | `.card` > `.icon-badge` + `h3.card-title` + `.card-body`, in `.grid-broken` | `about.dc.html` |
| Price card | `.card` > `.photo` + `.card-kicker` + `.price.chrome` + `.card-body` | `services.dc.html` |
| Photo | `figure.photo` > `<image-slot>`; ratio via `--ratio` / `.photo-portrait` / `.photo-wide` | `services.dc.html` |
| Polaroid portrait | `figure.polaroid` > `img.paperclip` + `.photo` (+ `.sticker`) | `about.dc.html` |
| Gallery | `.gallery` of `figure.photo`. Groups of five; **add photos in fives**; never `auto-fill` | `gallery.dc.html` |
| Booking band | `<section class="cta-zone zone surface surface-fur">` > `.wrap` > `.cta-band` (`img.pin`, text, `.cta-actions`) | `about.dc.html` |
| Form | `.form` > `.form-row` / `.field` (`label` + `.input`), `.dd` dropdown, `.fieldset` + `.check`, `.seg`, `.alert`, `.form-hint`, `.tag` | `contact.dc.html` |

## Motion

Durations `--dur-fast/--dur/--dur-slow`, easings `--ease-out/--ease-spring`,
`--marquee-dur`, `--float-dur`. Only `transform` and `opacity` animate.
Under `prefers-reduced-motion` the marquee, floats, parallax and arrow drawing stop.
The turntable stays, because it is content driven by the visitor's own scrolling.

## Focus & touch

Focus is a 3 px **dashed** ink outline with a 4 px offset. Touch sizes go by `pointer: coarse`:
buttons ≥ 48 px, footer links ≥ 44 px.

## Assets

Everything in `tex/` and `obj/` is rendered in Blender. Source and pipeline:
`Werkzeuge/chrome-assets/` (readme there). Never edit the exported files by hand.
