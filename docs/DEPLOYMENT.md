# Static deployment

The deliverable is the complete **`dist/` directory** produced by `npm run build`. React, the Motion Canvas player, compiled glyphs, CSS and fonts are served as static files. Never deploy the development server or the authoring editor as the student site.

## GitHub Pages

1. Create your repository from this template and push your content.
2. In its **Settings → Pages**, choose **GitHub Actions** as the source.
3. Under **Actions**, enable workflows if GitHub asks. Open **Deploy to GitHub Pages → Run workflow**, choose `main`, and run it.
4. Wait for the build/test job and deployment to finish. The deployment job prints the published URL, also visible under Settings → Pages.

The workflow needs the built-in `GITHUB_TOKEN` only; no personal token or repository secret is required. Public repositories can use the ordinary free Pages offering. Repository or organization policies may impose an environment approval; follow the policy shown by GitHub.

The provided CI workflow runs on pushes/PRs. The deployment workflow publishes the model, TD3 and TD5 when their source or build configuration changes on `main`; it also supports manual dispatch. For a freshly copied template, configure Pages before publishing. Remove the `push` trigger from `.github/workflows/deploy.yml` if you prefer manual publication only.

The workflow runs `npm ci` and `npm run validate` independently in the root, `presentations/td3-fonctions` and `presentations/td5-limites`, then combines their build outputs in the root `dist/` directory.

| Content | Public URL |
| --- | --- |
| Presentation model | https://malek452.github.io/atelier-presentations/ |
| TD3 | https://malek452.github.io/atelier-presentations/td3-fonctions/ |
| TD5 | https://malek452.github.io/atelier-presentations/td5-limites/ |
| TD5 printable correction | https://malek452.github.io/atelier-presentations/td5-limites/handout/ |

These links require no account. Each presentation keeps its own assets, animation player and handout in its published subdirectory.

Vite uses relative asset URLs (`base: './'`), so a project URL such as `https://USERNAME.github.io/REPOSITORY/` works without hard-coding a username. Activity navigation uses hashes; no SPA route rewrites are necessary.

## Netlify or another static host

Use Node 24, build command `npm run build` and publish directory `dist`. `netlify.toml` provides these settings for Netlify. Run `npm test` locally or in CI before publishing. Upload the entire directory, including `animations/`, `assets/` and `handout/`.

## Local production check

```sh
npm ci
npm run validate
npm run preview
```

Visit the URL printed by the preview server. Test a direct `#activity/...` link, playback and a hard refresh. Open `handout/` too. Opening `dist/index.html` directly as a `file:` URL is unsupported because the browser must load JavaScript modules over HTTP(S).

No automatic offline service worker is included. The hosted site needs an initial network connection; all its application/font assets come from the same deployment. Keep the published player and HTML from the same build to avoid stale-manifest errors.

Reference: [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
