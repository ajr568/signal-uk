# Signal UK

A modern homepage prototype for a UK amateur radio community platform.

## What is included

- Responsive landing page for a UK amateur radio community
- Traditional static front-end with a modern radio-inspired design
- Live public API data panel powered by G7VRD endpoints:
  - callsign to locator lookup
  - WSPR activity feed
  - band propagation data
- Fallback values if public APIs fail or are rate-limited

## Run locally

This is a dependency-free static prototype. Open `index.html` in a browser, or serve the directory with any static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## API notes

The live data section calls public amateur radio endpoints from G7VRD. These endpoints are useful for a demo, but they may change or rate-limit over time. If you later want production-grade reliability, add a small backend proxy to cache the responses and reduce third-party API dependence.

## Next steps

- Replace sample clubs and events with a database-backed directory
- Add a real map provider and location search
- Add club/event submission and moderation
- Connect official UK licensing and repeater data
- Add authentication and optional logbook integrations
