# 4you Taxi

One-page website for 4you Taxi in Jönköpings län, in Swedish (`/`), English (`/en/`) and Arabic (`/ar/`, right to left).
Built with [Astro](https://astro.build) and Tailwind CSS. See `CLAUDE.md` for the full project brief.

## Requirements

- [Node.js](https://nodejs.org) **22.12 or newer** (the LTS installer is fine). Check with `node -v`.

## Commands (PowerShell)

```powershell
npm install        # once, after cloning or pulling new dependencies
npm run dev        # local dev server at http://localhost:4321
npm run build      # type-check and build the site into dist/
npm run preview    # serve the built site from dist/
npm run lint       # ESLint + Prettier check
npm run format     # fix formatting with Prettier
```

## Editing content

All text, the phone number, email and translations are in `src/data/site.ts`.
Values written as `[[LIKE_THIS]]` are placeholders waiting for real content.

Colours, radius and sizes are in `src/styles/tokens.css`.

## Line endings on Windows

The repo stores files with LF line endings (`.gitattributes`). If `npm run lint` reports every file as
badly formatted after cloning on Windows, re-checkout once. This throws away uncommitted changes, so
commit them first:

```powershell
git rm --cached -r .
git reset --hard
```
