# Dopamine design system

Maximalist, dark and loud — but built around the product. The ground is the black
marble of the display stand; the five accents come from the nail set itself.
Link one file from every page and take everything from its tokens:

```html
<link rel="stylesheet" href="_ds/dopamine/styles.css">
```

Replaced **Organic** on 2026-10-14 (archived in `Backups/`). Token names that
existed in Organic kept their names: `--color-bg`, `--color-text`, `--color-accent`,
`--color-accent-2`, `--font-heading`, `--font-body`, `--space-*`, `--radius-*`,
`--shadow-*`. **Gone:** the 100–900 ramps (`--color-accent-700` etc.) — on the dark
ground every accent is already text-safe, so use the base accent.

## Colour

| Token | Role | As text on `--color-bg` |
|---|---|---|
| `--color-accent` `#ff3d9a` | 1 · lily magenta | 5.9 : 1 |
| `--color-accent-2` `#b8f04a` | 2 · ombré lime | 13.9 : 1 |
| `--color-accent-3` `#ffc93c` | 3 · stand gold | 12.4 : 1 |
| `--color-accent-4` `#9b5cff` | 4 · vintage grape | 4.9 : 1 |
| `--color-accent-5` `#ff7a59` | 5 · coral | 7.5 : 1 |

- Body copy is always `--color-text` (white) or `--color-text-soft`.
- Accents may carry labels, kickers and links (all pass AA).
- **Text on an accent fill is `--color-ink`, never white** — white on magenta is 3.3 : 1.

### Tones — colour rotation
`.tone-1` … `.tone-5` set three custom properties: `--tone` (the colour),
`--clash` (border/first shadow, from the far side of the palette) and `--echo`
(second shadow). Components read those, so a tone class recolours anything.
Put `.tones` on a parent to rotate its children through all five (`nth-child(5n+k)`).
Give each page section a different tone; don't repeat one in consecutive sections.

## Type

Outfit 900 uppercase for headings, DM Sans for body (18 px base), Caprasimo only
for the wordmark, form labels and stickers. Headings carry stacked text shadows
automatically (`h1` mega, `h2` triple, `h3` double). Helpers:
`.grad-text` (animated gradient — use on one word in roughly every third headline),
`.thin` (lighter weight for one word), `.kicker`, `.lede`.
Below ~44 px drop to `--ts-2`: the full stack smears at small sizes.

## Sections

`.zone` = full-width band with its own stacking context. Combine with:
- one texture: `.tex-dots`, `.tex-stripes`, `.tex-checker` (drawn in `::before`, coloured by `--tone`)
- optionally `.mesh` (radial gradient mesh on the element itself)
- `.wrap` inside for max-width and the generous vertical padding

The page itself always has two fixed global layers (dots + stripes) on `body::before`.

Decoration lives inside a zone, `aria-hidden="true"`, and sits **behind** content:
`.bg-word` (oversized outlined word), `.deco` + `.deco-ring` / `.deco-blob` /
`.deco-emoji` / an inline SVG (filled Lucide sparkle or star). Position them in the
page's helmet styles. Roughly 4–8 per section; 1–2 emoji.

## Components

| Class | Notes |
|---|---|
| `.btn` + `.btn-primary` / `-secondary` / `-outline` / `-ghost` / `-ink` / `-icon` / `-sm` / `-block` | Pill, 4 px border, uppercase. Primary = gradient, lime border, glow + hard shadow. `-ink` is for bright surfaces. |
| `.card` + `.card-kicker` / `-title` / `-body` / `-meta` | 4 px tone border, two-layer hard shadow, `--tilt`. `a.card` lifts on hover. Variants `.card-dashed`, `.card-double`, `.card-asym`. `.sticker` pins a label to a corner. |
| `.grid-broken` | Auto-fit grid; tilts every item and drops every other one when items sit side by side. |
| `.tag` + `-accent` / `-accent-2` / `-neutral` / `-outline` | |
| `.field` > `label`, `.input`, `.radio` + `.dot`, `.seg` + `.seg-opt` | Same markup as Organic. |
| `.table`, `.dialog-backdrop` > `.dialog` | |
| `.nav`, `.nav-brand`, `.nav-actions`, `.nav-menu-anchor`, `.nav-menu`, `.nav-cta-more` | Shared header — see `index.dc.html` for the markup to copy. |
| `.site-footer` > `.wrap` > `.footer-id` + `.footer-col` | Shared footer. |
| `.washed` | Kept for `<image-slot>` compatibility; now a slight lift, not a wash-out. |

## Page recipes

Copy from the page named; each needs no page CSS beyond positioning.

| Recipe | Markup | Example |
|---|---|---|
| Page header | `<header class="page-head zone mesh tex-* tone-N">` with `.bg-word`, `.deco.deco-ring.ph-ring`, `.deco.ph-spark`, `.deco.ph-star`, then `.wrap` > `.kicker` + `h1` + `.lede` | every subpage |
| Section heading | `.section-head` > `.kicker` + `h2` + `.lede` | `services.dc.html` |
| Booking band | `<section class="cta-zone zone …">` > `.wrap` > `.cta-band.tone-N` (+ `.cta-emoji`, `.cta-actions`) | `index.dc.html` |
| Rules list | `<ol class="rules tones">` of `<li>` — `<sc-if>` around items is fine | `terms.dc.html` |
| Reading panel | `.card.paper.prose` (h2 + p + ul) | `privacy.dc.html` |
| Key/value list | `<dl class="facts">` | `imprint.dc.html` |
| Photo | `<figure class="photo washed">` > `<image-slot>` (`.photo-portrait`, `.photo-wide`) | `about.dc.html` |
| Gallery | `.gallery.tones` of `.photo` — groups of five (one 2×2 + four singles), 2 columns on phones, 4 from 720px. **Add photos in fives** so the grid closes; never switch it to `auto-fill` | `gallery.dc.html` |
| Feature card | `.card` > `.icon-badge` + `h3.card-title` + `.card-body` | `about.dc.html` |
| Form | `.form` > `.form-row` / `.field`, `.dd` dropdown, `.fieldset` + `.check`, `.alert` | `contact.dc.html` |

Decoration helpers: sizes `.deco-sm/md/lg`, positions `.at-tr/tl/br/bl`, `.at-edge-r`.
Give each section a different tone than the one before it.

## Motion

`.anim-float`, `.anim-float-r`, `.anim-wiggle`, `.anim-bounce`, `.anim-spin`,
`.anim-pulse` (primary CTA only, one per screen), `.delay-1…3` to stagger.
Scroll-driven movement (the turntable, anything reading `--turn`) is not
self-running and stays on. Under `prefers-reduced-motion` every self-running
animation stops; hover/press feedback stays at 150 ms.

## Focus & touch

Focus is a 4 px **dashed** gold outline, 4 px offset — the dash is the structural
cue, so focus never relies on colour alone. Touch sizes go by `pointer: coarse`,
not width (same rule as Organic): buttons ≥ 48 px, footer links ≥ 44 px.
