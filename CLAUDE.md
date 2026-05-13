# Elastic Community Links — Claude Guide

This is a static link page site for Elastic community program managers. One page per region, auto-deployed to Vercel on every merge to `main`.

## What this project does

Each region has a JSON file in `regions/`. When `node build.js` runs, it reads those files and generates static HTML pages in `public/`. Vercel runs the build on every deploy and serves the output.

## Project structure

```
regions/          <- One JSON file per region. This is what PMs update.
assets/           <- CSS, images, and rum.src.js (browser RUM source)
api/track.js      <- Vercel serverless function for link click tracking
scripts/          <- validate-regions.js (JSON validator)
build.js          <- Builds the static site into public/
public/           <- Generated output. Do NOT edit files here directly.
```

## Region file schema

Every file in `regions/` follows this structure:

```json
{
  "region": "India",
  "profile": {
    "name": "Elastic India User Group",
    "description": "Learn, connect and grow with the Elastic community across India."
  },
  "sections": [
    {
      "title": "Section heading",
      "links": [
        { "title": "Button label", "url": "https://example.com" }
      ]
    }
  ]
}
```

- `profile.name` and `profile.description` are required
- `sections` is an array -- each section has a `title` and a `links` array
- Each link needs both `title` and `url`
- The last item in any array must not have a trailing comma

## Common tasks

**Add a link to a region**
Edit the relevant file in `regions/` and add a new line inside the correct section's `links` array:
```json
{ "title": "New Link", "url": "https://example.com" }
```

**Add a new section**
Add a new object to the `sections` array with a `title` and a `links` array.

**Validate all region files**
```bash
node scripts/validate-regions.js
```
Run this before pushing. GitHub Actions also runs it automatically on every PR.

**Build the site locally**
```bash
node build.js
```
Output goes to `public/`. You can preview it with `npx serve public -p 3000`.

## Workflow rules

- Never commit directly to `main` -- always open a pull request
- The `validate` GitHub Actions check must pass before merging
- PRs require at least one approval from Som or Kartikay
- Never manually edit anything inside `public/` -- it is generated on every build

## Contact

For help, reach out to Som or Kartikay.
