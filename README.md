# Local Positioning System — project website

Single-page site for the Local Positioning System (LPS), a privacy-preserving
positioning sensor developed at the QUT Centre for Robotics. LPS keeps
positioning working where GPS cannot — tunnels, carparks and indoor
environments — by matching a low-resolution sensor signature against a compact
local reference map, with no beacons or roadside infrastructure.

**Live site:** https://local-positioning-system.github.io/transport/

Contact: Professor Michael Milford, FTSE — michael.milford@qut.edu.au

## Structure

- `index.html` — the whole page
- `static/css/index.css` — design tokens (cream background, teal accent) and layout
- `static/js/index.js` — hero video carousel initialisation
- `assets/` — demonstration videos, poster frames, photographs and funder logos

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

GitHub Pages serves the `main` branch from the repository root, so pushing to
`main` publishes the site. No build step.

## Credits

Template adapted from [nerfies.github.io](https://github.com/nerfies/nerfies.github.io)
(CC BY-SA 4.0). The Bulma CSS framework, single-column layout and video carousel
component are retained; all Nerfies content, analytics and media were removed.

Funded by the Australian Research Council, iMOVE CRC, QUT and Australia's
Economic Accelerator.
