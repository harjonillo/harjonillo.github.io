# harjonillo.github.io

Personal portfolio — Astro static site with React islands. Design and content
spec live in `astro-project-brief.md`; the visual design source of truth is
`portfolio-mockup-v4.html`.

## Commands

```sh
npm install     # install dependencies
npm run dev     # dev server at localhost:4321
npm run build   # static build to dist/
npm run preview # serve the build locally
```

## Where things live

- **Content** (`src/content/`): one Markdown file per job, publication, project,
  recipe, art piece, or journal entry. Adding content never requires touching a component.
  Schemas are in `src/content.config.ts`.
- **Design tokens** (`src/styles/tokens.css`): locked palette + layout vars.
- **Shared styles** (`src/styles/global.css`): ported from the mockup.
- **Islands** (`src/components/islands/`): the only client-side JS —
  RecipeScaler, ArtGallery, OpticalBench.
- **Static assets** (`public/`): favicon, CV PDF (`cv/`), OG images (`og/`).
  Art scans go in `src/assets/art/` for the image pipeline.

## Writing in the journal

Entries live in `src/content/journal/`, one Markdown file each. Name the file
`<thread>-<NNN>-<short-name>.md`, e.g. `llm-abm-002-encounters.md`; the file
name (without `.md`) becomes the URL: `/journal/llm-abm-002-encounters`.

```md
---
title: 'Encounters: proximity first, then a decision'
date: 2026-10-29
summary: One line, shown on /journal and under the title.
thread: llm-abm
entry: 2
project: multiagent-island
draft: true
---

## First section

Text…
```

- **`thread`** must be one of the names on line 9 of `src/lib/journal.ts`
  (`THREADS`). To start a new thread, add its name there first, or the build
  fails.
- **`entry`** is the number within the thread, shown as `#002`. Two entries
  with the same thread and number fail the build.
- **`project`** (optional) adds a "Related project" card linking to that
  project on `/projects`, and a "Journal →" link on the project's card. Use the
  project's file name without `.md` (`multiagent-island`, `this-website`). If
  there's no related project, delete the whole line; `project:` with nothing
  after it breaks the build.
- **`draft: true`** shows the entry in `npm run dev` but leaves it out of the
  published site. Delete the line (or set `false`) to publish.
- Quote the title if it contains a colon, as above.

In the body:

- **Sections**: each `##` heading becomes a link in the entry's Contents list.
- **Side notes**: write ordinary footnotes. `text.[^1]` with `[^1]: The note.`
  at the bottom becomes a numbered note in the right margin (under its paragraph
  on phones). A label starting with `note-`, like `[^note-sketch]`, gives a note
  without a number. Notes can hold text, links and emphasis, not lists or code.
- **Figures**: put images in `src/assets/journal/` and add the caption as the
  image's title, on a line of its own:
  `![Alt text describing the image](../../assets/journal/map.png "Fig. 1. Caption.")`
  Don't write a `<figure>` or `<img>` tag by hand; local images in raw HTML
  don't load.
- **Code**: fenced code blocks with a language (` ```python `) get colors that
  follow light/dark mode.

Text on the `/journal` page itself (heading, intro paragraph, and the
description used by search engines and link previews) is in
`src/pages/journal/index.astro`.
