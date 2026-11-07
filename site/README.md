# fantasyapp.io site

Static site, no build step needed to host it: upload this folder as-is.

- `index.html` portal, `cfb/index.html` Fantasy CFB page, `cfb/demo/index.html` demo page
- `assets/style.css` shared styles, `assets/fonts/` bundled Anton + Manrope (no Google Fonts)
- `build.py` regenerates the three pages (`python3 build.py`). Edit games in the `games` list.

Not done yet: playable demo, tour video, email signup (form is not connected), pages for the other games, "Get the code" link (points to github.com).
