# Design concept — "Signal"

**One defended idea:** Sharif builds realtime systems and the tools that ship
them, so the site is a single continuous surface with a live signal running
through it.

## Principles

1. **Scene logic, not page logic.** Three acts: paper (story) → vermilion
   (stack) → ink (work, log, writing, contact). The background tweens between
   them; nothing snaps.
2. **Typography carries the craft.** Fraunces (variable, optical sizes, soft/
   wonky axes) for display, Instrument Sans for reading, IBM Plex Mono for
   metadata. Kinetic touches only where they mean something: the name skews
   with scroll velocity; headings rise out of masks.
3. **Restraint over spectacle.** One canvas (the hero oscilloscope), transform/
   opacity animations only, WebP plates with srcset, Lenis smoothing on wheel
   and native scrolling on touch.
4. **Everything degrades.** Reduced motion removes the intro, smoothing and
   reveals without hiding content. Keyboard users get a skip link, focus rings
   and an inert overlay menu.

## Palette

| Token        | Paper     | Accent    | Ink       |
| ------------ | --------- | --------- | --------- |
| `--bg`       | `#F3EEE4` | `#FF4F1F` | `#0F0E0C` |
| `--fg`       | `#0F0E0C` | `#0F0E0C` | `#F3EEE4` |
| `--accent`   | `#FF4F1F` | `#0F0E0C` | `#FF4F1F` |

## Signature moments

- Intro: a vermilion line draws across ink, then the curtain lifts.
- Hero: "Sharif" at ~24vw, a living oscilloscope band that reacts to the
  pointer and scroll velocity.
- Stack: skills as "signal strength" bars (4 = master) on a full-bleed
  vermilion chapter with an italic marquee.
- Work: pinned horizontal strip on desktop with plate parallax and a counter;
  vertical stack on touch.
- Contact: oversized email link with an underline that draws out on hover.
