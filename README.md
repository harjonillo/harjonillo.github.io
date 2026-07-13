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
  recipe, or art piece. Adding content never requires touching a component.
  Schemas are in `src/content.config.ts`.
- **Design tokens** (`src/styles/tokens.css`): locked palette + layout vars.
- **Shared styles** (`src/styles/global.css`): ported from the mockup.
- **Islands** (`src/components/islands/`): the only client-side JS —
  RecipeScaler, ArtGallery, OpticalBench.
- **Static assets** (`public/`): favicon, CV PDF (`cv/`), OG images (`og/`).
  Art scans go in `src/assets/art/` for the image pipeline.
