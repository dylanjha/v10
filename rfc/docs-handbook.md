---
status: draft
---

# Documentation information architecture: Handbook

## Problem

The docs are currently organized by Diátaxis mode: `concepts/` (explanation), `how-to/` (task guides), and `reference/` (generated API pages). This split works for maintainers deciding where prose lives, but it does not match how readers — or coding agents — arrive at the docs.

A developer implementing autoplay, captions, or quality selection arrives with a capability in mind, not a documentation mode. Today that reader has to assemble an answer from a concept page (if one exists), a how-to guide (only three exist), and several reference pages. Most capabilities have no page at all: there is no page for autoplay, text tracks, live playback, picture-in-picture, video quality, errors, or persistence. The reference pages document each API in isolation but nothing connects a capability's components, features, state, and events into a recommended implementation.

The same gap hurts agent consumers. Agents retrieve one or two pages per query; when the recommended approach for a capability is spread across modes, agents synthesize incomplete or mixed guidance (for example, combining incompatible approaches from a concept page and a reference example). The docs already ship agent affordances — per-page Markdown, Copy Markdown, and `llms.txt` — but the unit of retrieval is wrong.

Secondary problems the current structure creates:

- The `concepts/` vs `how-to/` boundary is already unclear in practice (see the note on `docs.config.ts` about the Getting started / Concepts boundary, issue #1105). Authors default to concept pages because the doctrine says to, producing understanding-oriented pages where readers need implementation guidance.
- "Reference" is one flat bucket in the content tree even though the sidebar already distinguishes visual components from programmatic APIs; the top-level navigation does not make that distinction legible.
- There is no home for small, complete, outcome-shaped implementations (background video, custom UI, responsive player), so they either become bloated guide sections or don't get written.

## Customer salience

- Capability-shaped questions dominate real support surfaces for every player library: "autoplay doesn't work on iOS", "how do I add captions", "how do I show a quality menu". These are the queries the docs must answer in one page.
- An increasing share of Video.js 10 integration will be written by coding agents. Pages that state one canonical approach, use exact export names, and keep a complete Markdown representation measurably reduce agent error; this is the same reasoning that produced `build-with-ai` and `llms.txt`.
- Peer libraries validate the shape: Vidstack's capability/component references and Base UI's handbook pages (Composition, Styling, TypeScript, Accessibility) are the closest models, and both are frequently cited as the docs experience developers expect.

## Options considered

### 1. Keep Diátaxis, fill the gaps within it

Write the missing capability content as more concept pages plus more how-to guides. No structural change, no redirects. Rejected because it doubles the number of pages a reader must assemble per capability and deepens the mode-boundary ambiguity that already exists. Reversible, but it spends the content-writing budget on the wrong unit.

### 2. Restructure the sidebar only

Regroup existing pages under new labels without moving files or URLs. Cheapest, fully reversible. Rejected as a destination because the content-directory-equals-URL convention would permanently fossilize `concepts/` and `how-to/` in URLs, the frontmatter and template work is still needed for agent quality, and the missing capability pages are still missing. Acceptable only as an intermediate state.

### 3. Handbook restructure (recommended)

Replace `concepts/` and `how-to/` with a single **Handbook** organized around capabilities and durable references, promote Components and API to separate top-level reference sections, and add an Examples section. Old URLs redirect. This is the only option whose unit of authorship matches the unit of retrieval.

Reversibility: moderate. URL moves are mitigated by redirects; the template and metadata are additive; the writing effort (~24 new pages) is the real commitment and is valuable under any structure.

## Recommendation

### Top-level structure

1. **Getting Started** — installation, Why Video.js, roadmap, changelog, browser support.
2. **Handbook** — capability pages and durable references (detailed below).
3. **Components** — reference for visual UI primitives (usage, parts, props, state, events, data attributes, CSS variables, accessibility). Already generated; becomes its own top-level section.
4. **API** — reference for non-visual programming interfaces: player factories, features, hooks, controllers and mixins, media elements, utilities, types. Kept separate from Components.
5. **Examples** — small, complete implementations for common outcomes (background video, custom player UI, responsive player, live player, captions, quality selection, remote playback, persisted preferences). Examples compose Handbook guidance, Components, and API; they are not another reference source.

### Handbook contents

A Handbook page is one of two things:

- **Capability** — something the player can do: Sources and Loading, Playback, Autoplay, Live Playback, Fullscreen and Orientation, Picture-in-Picture, Remote Playback, Text Tracks, Audio Tracks, Video Quality, Posters and Thumbnails, Controls and User Activity, Keyboard and Pointer Input, Localization, Storage and Persistence, Errors and Recovery.
- **Important reference** — a durable concept spanning capabilities: Overview, Composition, Features, Events, Media, Presets and Skins, Styling, TypeScript, Accessibility, Responsive Design, Browser Support, Performance, Server Rendering, CORS and Security, Building with AI.

A subject gets its own page only when it has a distinct developer intent, meaningful browser or platform constraints, multiple APIs that must be explained together, enough implementation guidance to justify a page, and strong search value. Otherwise it stays a section of a broader capability (volume → Playback; chapters → Text Tracks) or becomes an Example (background video).

### Handbook page template

Every Handbook page uses the same structure and stable anchors:

1. **Summary** — one or two sentences.
2. **Recommended approach** (`#recommended-approach`) — the preferred implementation stated directly, with the smallest complete example first: imports, player setup, required props or features, relevant UI, and failure handling when it matters. Firm language; no introductory prose.
3. **How it works** — only the concepts needed to understand or modify the implementation, using exact exported names.
4. **Availability and constraints** (`#availability-and-constraints`) — browser restrictions, platform differences, permission or interaction requirements, expected failure modes. Stated directly, not hidden in asides.
5. **Common variations** (`#common-variations`) — alternatives shown separately so they are not combined with the recommended approach.
6. **Troubleshooting** (`#troubleshooting`) — symptom, likely cause, direct fix.
7. **Related references** — always three groups: Related Components (`#related-components`), Related API (`#related-api`), Related Handbook Pages.

Sections that don't apply may be omitted, but present sections keep these names and this order.

### Agent experience principles

These apply to all Handbook and Example pages:

- **One intent per page** with a literal, searchable title (Autoplay, not Advanced Playback).
- **Answer first**: the recommended implementation opens the page.
- **One canonical approach**; alternatives live under Common variations so agents don't merge incompatible paths.
- **Exact names** for packages, components, props, features, state, actions, events, data attributes, and CSS variables — never only descriptive prose.
- **Complete examples** that compile without invented setup; primary examples are real files imported into MDX (and therefore type-checked in CI), not inline fences.
- **Constraints stated directly** ("Autoplay can fail", "Google Cast is loaded only when requested").
- **Plain-text completeness**: no essential content only inside tabs, demos, hover content, or collapsed sections; every page keeps a complete Markdown representation. Copy Markdown and `llms.txt` remain part of the architecture.
- **Machine-readable frontmatter** in addition to visible content:

```yaml
title: Autoplay
description: Start playback automatically and handle browser autoplay restrictions.
category: capability   # capability | reference
components: [PlayButton, MuteButton]
api: [playbackFeature, volumeFeature]
keywords: [autoplay video, muted autoplay, autoplay failure]
```

### Migration

- Existing pages map into the new structure; the notable merges are skins + presets + customize-skins → Presets and Skins + Styling, and ui-components + build-your-own-component → Composition. `concepts/cast` seeds the Remote Playback capability page.
- Content moves to `handbook/` (and `getting-started/`, `examples/`) directories; old `concepts/*` and `how-to/*` URLs receive redirects.
- The authoring doctrine in `write-guides` is rewritten: the Handbook intentionally combines explanation and task guidance on one capability page. This is a deliberate departure from Diátaxis's mode separation, traded for retrieval-sized pages. Reference pages remain a distinct mode and keep their generated pipeline.
- The `write-docs` and `review-docs` skills are updated to enforce the template, and a heading-order check runs in CI alongside the existing link and type checks.
- Sequence: (1) this RFC, (2) an Autoplay pilot page validating the template end to end, (3) schema/sidebar/redirect infrastructure, (4) migration of existing pages, (5) new capability and reference pages in priority order, (6) Examples.

## Open questions

- **Availability model.** The library already defines `MediaFeatureAvailability = 'available' | 'unavailable' | 'unsupported'` (`packages/media/src/core/types.ts`), and features expose it in state (for example `volumeFeature`'s `volumeAvailability`). What still needs an audit is consistency: whether every capability with platform constraints exposes an availability property, and whether components reflect it through data attributes for CSS. Gaps found are a core-library workstream, not a docs decision.
- **Examples implementation.** Whether Examples are a new content collection, curated sandbox templates, or preset-adjacent (background video currently exists as a media-element reference page and as a preset concept) needs a design record once the section is scheduled.
- **Home for self-hosting.** `how-to/self-host-the-player` fits neither Handbook list cleanly; likely Getting Started or a Performance section.
- **Localization timing.** The i18n opaque-key conversion should settle before the Localization capability page is written.

## Success measures

- A capability question ("make autoplay work", "add captions", "show a quality menu") is answerable from exactly one Handbook page, verified for the pilot set by using each page as the sole context for an agent implementing the capability.
- Every Handbook page passes the template check (heading set, order, anchors) and its primary example compiles in CI.
- Old URLs 301 to their replacements with no search-console regressions after migration.
- `llms.txt` and per-page Markdown reflect the new structure with accurate section descriptions.

## Final decision

Pending review.
