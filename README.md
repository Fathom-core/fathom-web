# Fathom Web

The first page of Fathom: a connected AI ecosystem built around self-hosted,
open-weight intelligence. Apollo is the flagship in a planned family of models.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Create a production bundle with `npm run build`;
`npm run preview` serves that bundle locally on port 4173 with the bundled
dependency-free preview server. Use `npm run preview -- --port 5173` to choose a
different port.

## The first-page experience

- A custom Three.js sculpture woven from 94 copper filaments, with drag rotation,
  pointer response, three interaction modes, and a WebGL fallback.
- GSAP entrance and scroll choreography, with Lenis scrolling, reduced-motion
  support, and a visitor-controlled motion pause.
- Three interactive workspace scenarios with editable prompts, simulated progress,
  previews, terminal output, replay, and cancellation.
- An Apollo introduction, an interactive ecosystem map, and an accessible FAQ.
- Responsive layouts and locally bundled fonts; no third-party image requests.

The workspace is a guided concept demo. It has no live model connection, account
system, cloud runtime, or persistence. The page labels these boundaries and the
planned product roadmap explicitly.

## Verification

`npm run build` runs strict TypeScript checks and creates the production bundle.
Automated browser inspection was blocked by the development session's browser
access policy. Visual layout, animation performance, and browser interactions
still need review in the local preview.

Stack: React, TypeScript, Vite, Three.js, GSAP, Lenis, and Lucide.
