# Fantasy NASCAR

A weekly fantasy NASCAR game for a small group of friends. Each week every player drafts three drivers, one each from tier A, B and C (tiers are set by season points: top 12, next 12, the rest). Snake draft, 12-hour pick clock, no double picks. Score = real NASCAR points plus bonuses (pole +5, Q2 +3, Q3 +1, led a lap +5, most laps led +5).

It is one `index.html` file on a free Firebase project. No build step. Try the demo first: https://fantasyapp.io/nascar/

## Set it up (about 30 minutes)

1. **Create a Firebase project** at console.firebase.google.com (free plan is plenty).
2. **Turn on Google sign-in:** Build > Authentication > Sign-in method > Google.
3. **Create a Firestore database:** Build > Firestore Database > Create database (production mode).
4. **Register a web app:** Project settings > Your apps > Web (`</>`). Copy the config values.
5. **Edit `index.html`:** paste the config into `firebaseConfig` and set `COMMISH` to the Google email you will sign in with (lowercase). That account is the commissioner and sees the Admin tab.
6. **Edit `firestore.rules`:** replace `you@example.com` with the same email.
7. **Deploy:** install the Firebase CLI (`npm i -g firebase-tools`), then in this folder run `firebase login`, `firebase use --add` (pick your project), and `firebase deploy`. Hosting gives you a `yourproject.web.app` link to share. In Authentication > Settings > Authorized domains, make sure that domain is listed (it usually is).

## Run a season

Sign in as the commissioner, open the **Admin** tab:

1. **Players:** one per line, `email,name`. Players must sign in with that Google email.
2. **Drivers:** one per line, `name,number,team,seasonPts,wins,color,make` (color and make are optional). Re-import before each week so the tiers use fresh points. A ready-to-paste, current list is in `data/drivers.csv` and at https://fantasyapp.io/nascar/data/
3. **Open a week:** week number, race name, and a lock time (the draft locks then, ideally before qualifying). Order is last place first, then snake. Week 1 is random.
4. After qualifying, paste the **qualifying order** (fastest first). After the race, paste **scores** (finishing order, `driver,points`) and **laps led**. https://fantasyapp.io/nascar/data/ has all three ready to copy, refreshed after every race. Saving scores marks the week as scored and updates standings, recap and awards.

Manufacturer logos are in `logos/` (small versions of Chevrolet, Ford and Toyota); set a driver's `make` to use them. Car-number badges load from nascar.com when available and fall back to `#number`.

## Notes

- Security: the rules let signed-in players read everything and make picks; only the commissioner changes anything else. I have not run these rules through the Firebase emulator, so test with a second account before relying on them.
- The Firebase web config is not a secret. Never commit a service-account key.
- Rebuild the site's demo after changing `index.html`: `python3 nascarsrc/make_demo.py` (from the fantasyapp-site repo root).

- The copy-paste data on fantasyapp.io is refreshed by `tools/update_nascar_data.py`, run by a GitHub Action after race day (`.github/workflows/nascar-data.yml`). It reads NASCAR's public JSON feeds, which are unofficial and could change.
