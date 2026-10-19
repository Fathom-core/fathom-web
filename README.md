# Fathom Web

The first page of Fathom: a connected agentic AI ecosystem built around
self-hosted, open-weight intelligence.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. `npm run build` checks TypeScript and creates the
production bundle. `npm run preview` serves that bundle on port 4173;
`npm run preview -- --port 5173` selects a different port.

## Homepage

- Violet-lit hero with the supplied crowned sculpture, textured typography,
  atmospheric halo, and restrained pointer-responsive 3D movement.
- Scroll choreography, locally bundled fonts, reduced-motion support, and a
  visitor-controlled animation pause.
- Interactive concepts for Chat, Cloud, Desktop, and CLI.
- An agent-workflow illustration, selectable ecosystem map, and accessible FAQ.
- Responsive mobile navigation and native account-information dialogs.

This is a product landing page, not a working AI service. Product previews are
explicitly illustrative. Inference, accounts, cloud execution, desktop downloads,
and CLI releases remain in development. No prompt or account data is collected.

## Sculpture assets

`model.glb` is the supplied original and is unchanged. The homepage loads
`public/models/fathom-core.glb`, a simplified, meshopt-compressed derivative with
2K WebP textures. `public/models/fathom-core.webp` is an alpha render made from
the original model; it displays immediately and remains visible when WebGL is
unavailable or software-rendered. No external 3D hosting is involved.

`src/Sculpture.tsx` lazily loads the WebGL scene, caps pixel density, suspends
rendering offscreen, and disposes graphics resources on unmount. `public/textures`
contains the procedural stone and grain textures used in the typography.

## Verification

`npm run build` runs strict TypeScript checks and creates the production bundle.
Browser QA covers desktop/mobile layout, product tabs and their sample controls,
the ecosystem map, FAQs, account dialogs, and motion controls. The development
browser has no working hardware WebGL context, so the rendered fallback is
visually verified here; live 3D lighting still needs a hardware-GPU browser check.

Stack: React, TypeScript, Vite, Three.js, GSAP, Lenis, and Lucide.
