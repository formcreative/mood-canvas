# Mood Palette

Mood Palette is a mobile-first interactive web app that turns natural language feelings into an immersive color canvas. Type how you feel, pick an emotion chip, or save the current mood as a 1290x2796 PNG wallpaper.

The app runs entirely in the browser. There is no backend, no API, and emotion detection is handled locally with editable keyword matching.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Deploy To Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

## Edit Emotion Colors

All mood definitions live in `src/data/emotions.ts`.

Each emotion includes:

- `id`
- `label`
- `keywords`
- `gradient`
- `accentColor`
- `textColor`
- `effect`
- `responseMessage`

Change the hex colors in `gradient` to adjust the full-screen background and generated wallpaper.

## Wallpaper Note

iOS does not allow normal websites or web apps to directly change the system wallpaper. Mood Palette can generate and download a wallpaper image, which users can then set manually from Photos or Settings.
