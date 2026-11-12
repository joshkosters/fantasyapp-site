#!/usr/bin/env python3
"""Refreshes the copy-paste data for the Fantasy NASCAR page from NASCAR's public JSON feeds.

Writes:
  site/nascar/data/season.json   the race ARCHIVE: every archived points race (qualifying, finish + points, laps led, and
                                 the driver list with points as of that race). New races are added after each race and
                                 old ones are never dropped. It started with the two most recent races, no backfill.
  site/nascar/data/drivers.csv   driver list in the app's Admin > Drivers format (points and wins refreshed)
  fantasy-nascar/data/drivers.csv  same file, kept in the open-source folder

Run by .github/workflows/nascar-data.yml (GitHub's servers can reach cf.nascar.com). Run locally from the
repo root with:  python3 tools/update_nascar_data.py [season] [races_to_keep]
The feeds are unofficial and undocumented, so if a run fails the old data stays in place."""
import csv, datetime, json, os, sys, urllib.request

BASE = 'https://cf.nascar.com'
SERIES = 1  # Cup
START_WITH = int(sys.argv[2]) if len(sys.argv) > 2 else 2  # races to archive on the very first run
UA = {'User-Agent': 'Mozilla/5.0 (fantasyapp.io data updater)'}


def get(path):
    with urllib.request.urlopen(urllib.request.Request(BASE + path, headers=UA), timeout=30) as r:
        return json.load(r)


def completed_races(year):
    now = datetime.datetime.utcnow().isoformat()
    try:
        lst = get(f'/cacher/{year}/{SERIES}/race_list_basic.json')
    except Exception:
        return []
    done = [r for r in lst if r.get('race_type_id') == 1 and r.get('winner_driver_id') and (r.get('race_date') or '') <= now]
    return sorted(done, key=lambda r: r['race_date'])


def race_block(year, r):
    res = get(f"/cacher/{year}/{SERIES}/{r['race_id']}/weekend-feed.json")['weekend_race'][0]['results']
    if not sum(x.get('points_earned') or 0 for x in res):
        return None  # exhibition race (no points), skip
    who = lambda x: [x['driver_fullname'].strip(), str(x.get('official_car_number') or x['car_number'])]
    fin = sorted(res, key=lambda x: x['finishing_position'])
    qual = sorted([x for x in res if (x.get('qualifying_position') or 0) > 0], key=lambda x: x['qualifying_position'])
    led = sorted([x for x in res if (x.get('laps_led') or 0) > 0], key=lambda x: -x['laps_led'])
    return {
        'drivers': standings_after(r['race_id']),
        'id': r['race_id'], 'name': r['race_name'], 'track': r.get('track_name', ''), 'date': r['race_date'][:10],
        'qual': [who(x) for x in qual],
        'fin': [who(x) + [x.get('points_earned') or 0] for x in fin],
        'led': [who(x) + [x['laps_led']] for x in led],
    }


def standings_after(race_id):
    """Driver list (league format) with season points and wins as of the end of this race."""
    try:
        live = {str(x['car_number']): x for x in get(f'/cacher/live/series_{SERIES}/{race_id}/live-points.json')}
        base = list(csv.reader(open('fantasy-nascar/data/drivers.csv', encoding='utf8')))
    except Exception as e:
        print('no standings snapshot for race', race_id, e)
        return None
    rows = []
    for row in base:
        x = live.get(row[1])
        if x:
            row = row[:3] + [str(x['points']), str(x.get('wins', 0))] + row[5:]
        rows.append(row)
    rows.sort(key=lambda r: -int(r[3]))
    return [','.join(r) for r in rows]


def update_drivers(year, path_in):
    """Refresh points and wins for the drivers already in the list. New drivers are added by hand."""
    rows = list(csv.reader(open(path_in, encoding='utf8')))
    try:
        pts = {p['driver_name'].replace('(C)', '').replace('(i)', '').replace('*', '').strip(): p for p in get(f'/cacher/{year}/{SERIES}/final/{SERIES}-drivers-points.json')}
    except Exception as e:
        print('standings feed unavailable, keeping driver points:', e)
        return rows
    out = []
    for row in rows:
        p = pts.get(row[0])
        if p:
            row[3], row[4] = str(p['points']), str(p.get('wins', 0))
        else:
            print('no standings entry for', row[0])
        out.append(row)
    out.sort(key=lambda r: -int(r[3]))
    return out


def main():
    year = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else datetime.date.today().year
    races = completed_races(year) or completed_races(year - 1)  # January: fall back to last season
    if not races:
        sys.exit('no completed races found, leaving data untouched')
    year = int(races[-1]['race_date'][:4])
    try:
        old = json.load(open('site/nascar/data/season.json', encoding='utf8'))['races']
    except Exception:
        old = []
    have = {b['id']: b for b in old}
    newest = max((b['date'] for b in old), default='')
    todo = [r for r in races if r['race_date'][:10] > newest]  # races finished since the last run
    todo += [r for r in races if r['race_id'] in have][-2:]  # re-check the latest two (late penalties, corrections)
    if not old:  # first run: start the archive with the most recent races only
        todo = []
        for r in reversed(races):
            if len(todo) >= START_WITH:
                break
            todo.append(r)
    for r in todo:
        b = race_block(year, r)
        if b:
            have[b['id']] = b
    blocks = sorted(have.values(), key=lambda b: b['date'], reverse=True)
    os.makedirs('site/nascar/data', exist_ok=True)
    json.dump({'updated': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ'), 'season': year, 'races': blocks},
              open('site/nascar/data/season.json', 'w', encoding='utf8'), separators=(',', ':'), ensure_ascii=False)
    rows = update_drivers(year, 'fantasy-nascar/data/drivers.csv')
    for dest in ('fantasy-nascar/data/drivers.csv', 'site/nascar/data/drivers.csv'):
        with open(dest, 'w', encoding='utf8', newline='') as f:
            csv.writer(f, lineterminator='\n').writerows(rows)
    print(f'archive now has {len(blocks)} races (latest: {blocks[0]["name"]}) and {len(rows)} drivers')


if __name__ == '__main__':
    main()
