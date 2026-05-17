# sf-june-26-endorsements
Endorsement tracker for the June 2026 primary elections in SF.

## Editing endorsements

Each race lives in its own YAML file under `src/_data/races/`. To update an endorsement:

1. Open the relevant file (e.g. `src/_data/races/supes-01.yml` for D4)
2. Edit or add a row in the `endorsements:` list
3. Run `npm run build` to regenerate `index.html`

## Running the build

```bash
npm install        # first time only
npm run build      # regenerates index.html from YAML sources
npm run dev        # live-reload server while editing
```

## YAML schema

**Standard race** (`pick` is the candidate color `c1`–`c6`, `noend` for formal no-rec, `multi` for a gradient multi-pick):
```yaml
section: supes
title: "District 4 — Sunset (ranked-choice)"
candidates:
  - id: alan
    label: "Alan Wong (incumbent, Lurie appointee)"
    color: c1
endorsements:
  - org: SF Chronicle
    url: https://...
    pick: c1           # or: noend, multi
    text: "Alan Wong"
```

**Measures** (`votes` values are `yes`, `no`, or `none`):
```yaml
section: measures
props:
  - id: A
    label: "Prop A (Bond)"
endorsements:
  - org: SF Chronicle
    url: https://...
    votes: {A: yes, B: no, C: none, D: none}
```
