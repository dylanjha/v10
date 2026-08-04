---
status: draft
---

# Documentation information architecture: Handbook

## Problem

Our docs are split into `concepts/` (pages that explain how things work), `how-to/` (pages that walk through a task), and `reference/` (generated API pages). This follows [Diátaxis](https://diataxis.fr), a documentation framework that says explanation, task guides, and reference should live on separate pages.

That split helps writers decide where to put prose. It does not help readers. A developer shows up thinking "I need autoplay" or "I need captions" — not "I need an explanation page." To answer one of those questions today, they have to piece together a concept page (if one exists), a how-to guide (only three exist), and several reference pages.

Worse, most capabilities have no page at all. There is nothing for autoplay, text tracks, live playback, picture-in-picture, video quality, errors, or persistence. The reference pages document each API on its own, but no page ties a capability's components, features, state, and events together into "here's how to build this."

Coding agents hit the same wall. An agent typically retrieves one or two pages per question. When the answer is spread across three kinds of pages, the agent stitches together incomplete or contradictory guidance — for example, mixing an approach from a concept page with an incompatible one from a reference example. We already ship agent-friendly output (per-page Markdown, Copy Markdown, `llms.txt`), but the pages themselves are the wrong shape.

Smaller problems with the current structure:

- Writers already struggle to decide what counts as a "concept" vs a "how-to" (see the note in `docs.config.ts` and issue #1105). They default to concept pages, so readers get explanations where they need instructions.
- "Reference" is one flat bucket, even though visual components and programmatic APIs are different things and the sidebar already treats them differently.
- Small, complete examples (background video, custom UI, responsive player) have no home, so they either bloat a guide or never get written.

## Customer salience

- The questions people actually ask about video players are capability-shaped: "autoplay doesn't work on iOS", "how do I add captions", "how do I show a quality menu". Each of these should be answerable from one page.
- A growing share of Video.js 10 integration will be written by coding agents. Pages that state one recommended approach, use exact export names, and have a complete Markdown version make agents measurably more accurate — the same reasoning behind `build-with-ai` and `llms.txt`.
- Other libraries already work this way. Vidstack's capability pages and Base UI's handbook (Composition, Styling, TypeScript, Accessibility) are the closest models, and developers frequently point to them as what good docs look like.

## Options considered

### 1. Keep the current structure, write the missing pages

Fill the gaps with more concept pages and more how-to guides. No structural change, no redirects. Rejected: readers would still have to combine two pages per capability, and the concept/how-to confusion would get worse. Reversible, but it spends our writing budget on the wrong shape of page.

### 2. Reorganize the sidebar only

Regroup existing pages under new labels without moving any files or URLs. Cheapest and fully reversible. Rejected as an end state: our URLs mirror the content directories, so `concepts/` and `how-to/` would be baked into URLs forever, and the missing pages would still be missing. Fine as a stepping stone only.

### 3. Handbook restructure (recommended)

Replace `concepts/` and `how-to/` with a single **Handbook** organized around capabilities, promote Components and API to their own top-level sections, and add an Examples section. Old URLs redirect to new ones.

This is the only option where the page we write is the page a reader (or agent) needs. Reversibility is moderate: redirects cover the URL moves, the template and metadata are additive, and the real commitment — writing ~24 new pages — is work we'd want under any structure.

## Recommendation

### Top-level structure

1. **Getting Started** — installation, Why Video.js, roadmap, changelog, browser support.
2. **Handbook** — capability pages and durable references (detailed below).
3. **Components** — reference for visual UI pieces (usage, parts, props, state, events, data attributes, CSS variables, accessibility). Already generated; becomes its own top-level section.
4. **API** — reference for everything programmatic: player factories, features, hooks, controllers and mixins, media elements, utilities, types. Separate from Components.
5. **Examples** — small, complete implementations of common outcomes (background video, custom player UI, responsive player, live player, captions, quality selection, remote playback, persisted preferences). Examples combine Handbook guidance, Components, and API; they are not another reference.

### What goes in the Handbook

A Handbook page is one of two things:

- **Capability** — something the player can do: Sources and Loading, Playback, Autoplay, Live Playback, Fullscreen and Orientation, Picture-in-Picture, Remote Playback, Text Tracks, Audio Tracks, Video Quality, Posters and Thumbnails, Controls and User Activity, Keyboard and Pointer Input, Localization, Storage and Persistence, Errors and Recovery.
- **Important reference** — a durable topic that spans capabilities: Overview, Composition, Features, Events, Media, Presets and Skins, Styling, TypeScript, Accessibility, Responsive Design, Browser Support, Performance, Server Rendering, CORS and Security, Building with AI.

A topic earns its own page only when it has a clear developer intent, real browser or platform constraints, several APIs that need explaining together, enough guidance to fill a page, and strong search value. Otherwise it stays a section of a bigger page (volume goes in Playback; chapters go in Text Tracks) or becomes an Example (background video).

### Page template

Every Handbook page uses the same sections, in the same order, with stable anchors:

1. **Summary** — one or two sentences.
2. **Recommended approach** (`#recommended-approach`) — the way we recommend building it, stated directly, with the smallest complete example first: imports, player setup, required props or features, relevant UI, and failure handling when it matters. No warm-up prose.
3. **How it works** — only the background needed to understand or modify the code above, using exact exported names.
4. **Availability and constraints** (`#availability-and-constraints`) — browser restrictions, platform differences, permission or user-interaction requirements, expected failure modes. Said plainly, not buried in asides.
5. **Common variations** (`#common-variations`) — alternatives, kept separate so they don't blend into the recommended approach.
6. **Troubleshooting** (`#troubleshooting`) — symptom, likely cause, fix.
7. **Related references** — always three groups: Related Components (`#related-components`), Related API (`#related-api`), Related Handbook Pages.

A page may skip a section that doesn't apply, but the sections it has keep these names and this order.

### Rules for agent-friendly pages

These apply to every Handbook and Example page:

- **One topic per page**, with a literal, searchable title (Autoplay, not Advanced Playback).
- **Answer first**: the recommended implementation opens the page.
- **One recommended approach**; alternatives go under Common variations so agents don't merge incompatible paths.
- **Exact names** for packages, components, props, features, state, actions, events, data attributes, and CSS variables — never just descriptions.
- **Complete examples** that compile without invented setup. Primary examples are real files imported into MDX, so CI type-checks them.
- **Constraints stated plainly** ("Autoplay can fail", "Google Cast is loaded only when requested").
- **Nothing essential hidden** in tabs, demos, hover content, or collapsed sections; every page keeps a complete Markdown version. Copy Markdown and `llms.txt` stay.
- **Machine-readable frontmatter** alongside the visible content:

```yaml
title: Autoplay
description: Start playback automatically and handle browser autoplay restrictions.
category: capability   # capability | reference
components: [PlayButton, MuteButton]
api: [playbackFeature, volumeFeature]
keywords: [autoplay video, muted autoplay, autoplay failure]
```

### Migration

- Existing pages map into the new structure. The notable merges: skins + presets + customize-skins become Presets and Skins + Styling; ui-components + build-your-own-component become Composition. `concepts/cast` seeds the Remote Playback page.
- Content moves into `handbook/` (plus `getting-started/` and `examples/`); old `concepts/*` and `how-to/*` URLs get redirects.
- The `write-guides` doctrine is rewritten. The Handbook deliberately puts explanation and task guidance on the same capability page — a departure from Diátaxis's separation, traded for pages sized to match how readers and agents retrieve them. Reference pages stay a separate mode with their generated pipeline.
- The `write-docs` and `review-docs` skills are updated to enforce the template, and CI gains a heading-order check next to the existing link and type checks.
- Order of work: (1) this RFC, (2) an Autoplay pilot page to prove the template, (3) schema, sidebar, and redirect infrastructure, (4) migrate existing pages, (5) write new capability and reference pages in priority order, (6) Examples.

## Open questions

- **Availability model.** The library defines `MediaFeatureAvailability = 'available' | 'unavailable' | 'unsupported'` (`packages/media/src/core/types.ts`), and features expose it in state (e.g. `volumeFeature`'s `volumeAvailability`). We need an audit: does every capability with platform constraints expose an availability property, and do components reflect it in data attributes for CSS? Gaps are core-library work, not a docs decision.
- **How to build Examples.** New content collection, curated sandbox templates, or preset-adjacent? (Background video currently exists as both a media-element reference page and a preset concept.) Needs a design record when the section is scheduled.
- **Where self-hosting goes.** `how-to/self-host-the-player` fits neither Handbook list cleanly; probably Getting Started or a Performance section.
- **Localization timing.** Wait for the i18n opaque-key conversion to settle before writing the Localization page.

## Success measures

- A capability question ("make autoplay work", "add captions", "show a quality menu") is answerable from exactly one Handbook page — verified for the pilot pages by giving an agent only that page and asking it to implement the capability.
- Every Handbook page passes the template check (section names, order, anchors), and its primary example compiles in CI.
- Old URLs 301 to their replacements with no search-console regressions.
- `llms.txt` and per-page Markdown reflect the new structure with accurate descriptions.

## Final decision

Pending review.
