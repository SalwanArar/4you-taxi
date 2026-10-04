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

Almost everything a visitor reads is in **one file: `src/data/site.ts`**. You never need to touch the
components to change a word, a number or a translation.

### Where things are in `site.ts`

| You want to change                        | Look for                                          |
| ----------------------------------------- | ------------------------------------------------- |
| Phone number                              | `business.phone` (change **both** lines, below)   |
| WhatsApp number                           | `business.whatsapp`                               |
| Email address                             | `business.email`                                  |
| Business name                             | `business.name`                                   |
| Car model name                            | `car.model`                                       |
| Designer credit in the footer             | `designer`                                        |
| Page title and Google description         | `content.<language>.meta`                         |
| Big headline and line under it            | `content.<language>.hero`                         |
| Button labels (Call now, WhatsApp, …)     | `content.<language>.actions`                      |
| Car facts (also the captions as it turns) | `content.<language>.carFeatures`                  |
| Languages the driver speaks, short bio    | `content.<language>.driver`                       |
| Contact heading and intro line            | `content.<language>.contact`                      |
| Area and availability                     | `content.<language>.serviceArea`, `.availability` |
| Footer text                               | `content.<language>.footer`                       |

`<language>` is `sv` (Swedish), `en` (English) or `ar` (Arabic). Each language has its own block with
the same names, so when you change a sentence, change it in **all three** blocks.

### Rules that keep the site working

- Only change the text **inside the quotes**: `title: 'Taxi i Jönköpings län',` → keep the `title:`,
  the quotes and the comma.
- If your text contains an apostrophe, write it as `\'` (for example `'Today\'s ride'`).
- **Phone number:** `display` is what people see (`'+46 73 725 01 75'`). `e164` is used by the call and
  SMS buttons and must have no spaces (`'+46737250175'`). The QR code is made from `e164`.
- **WhatsApp:** country code and number, digits only, no `+` (`'46737250175'`).
- **Car facts:** 4 to 6 short items. The first three also appear while the car turns. Only list things
  that are true for the car.
- **Driver bio:** empty (`''`) hides it. Write a sentence between the quotes to show it.
- Swedish and Arabic texts are drafts; have a native speaker read any new sentence.

Colours, fonts, radius and sizes are in `src/styles/tokens.css`. The car images are in
`public/car360/` (see `CLAUDE.md` §6 before replacing them).

### Option A: edit on github.com (no software needed)

1. Open <https://github.com/SalwanArar/4you-taxi/blob/main/src/data/site.ts> and sign in.
2. Click the pencil icon (**Edit this file**).
3. Change the text, then click **Commit changes…**, write a short note such as "New phone number",
   and choose **Commit directly to the `main` branch**.
4. Wait a few minutes. Check progress under the **Actions** tab (green tick = live), then reload
   <https://salwanarar.github.io/4you-taxi/>.

If the Actions run turns red, the file has a typing mistake (usually a missing quote or comma). Open
the failed run to see the line number, fix it the same way, and commit again.

### Option B: edit on your PC (preview before publishing)

```powershell
git pull                 # get the latest version first
npm install              # only needed the first time or after a dependency change
npm run dev              # open http://localhost:4321 (and /en/, /ar/) in your browser
```

Edit `src/data/site.ts` in any editor (VS Code is a good choice). The browser updates as you save.
When it looks right:

```powershell
npm run build            # must finish with 0 errors
npm run lint             # must pass; run "npm run format" to fix spacing
git add src/data/site.ts
git commit -m "Update phone number"
git push
```

The push to `main` publishes the site, as in Option A.

## Line endings on Windows

The repo stores files with LF line endings (`.gitattributes`). If `npm run lint` reports every file as
badly formatted after cloning on Windows, re-checkout once. This throws away uncommitted changes, so
commit them first:

```powershell
git rm --cached -r .
git reset --hard
```

## Publishing (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes it to
<https://salwanarar.github.io/4you-taxi/> on every push to `main` (and to the current work branch).
It sets `SITE_URL` and `BASE_PATH` so links and car frames work under `/4you-taxi/`.
Local `npm run dev` is unaffected and still serves from the root.
