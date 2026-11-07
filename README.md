# fantasyapp.io

Static site, deployed to Cloudflare Pages (project `fantasyapp`) on every push to `main`.

- `site/` is the deployable site. `site/build.py` regenerates the pages (`python3 build.py` from inside `site/`).
- `site/cc_page.py` builds the Crew Chief page. The embedded app lives in `site/crew-chief/app/` and is generated from the Crew Chief artifact by `ccsrc/make_app.py`.
- Setup: add a repo secret `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit).
