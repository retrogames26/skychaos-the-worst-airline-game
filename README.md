# Sky Chaos — Worst Airline Simulator (Prototype)

A browser-playable, first-person 3D airplane cabin prototype built with Three.js and Vite. It uses original procedural geometry rather than Dear Passengers assets.

## Current playable features
- Walk around a stylized airplane cabin with WASD and mouse look.
- Procedural seats, passengers, windows, cockpit, service trolley, food, and loose luggage.
- Three interactive duties: deliver a meal, secure luggage, and inspect a maintenance panel.
- Random turbulence warnings, cabin mood, cash rewards, progress HUD, and a results screen.
- Responsive HUD and desktop controls.

## Run locally
Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL Vite prints. Click **BOARD THE PLANE**, then use WASD to move, mouse to look, and E to interact. Click the game to recapture the mouse after releasing it with Escape.

Create a production build:

```bash
npm run build
npm run preview
```

The static production files are generated in `dist/`.

## Deploy to GitHub + Cloudflare Pages
1. Create a GitHub repository and upload the contents of this folder.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy.

No server or environment variables are needed for this prototype.

## Next development stages
1. Add real character animations and improved object physics.
2. Add flight takeoff, outside scenery, route selection, and landing.
3. Add server-authoritative multiplayer with WebSockets and Cloudflare Durable Objects (or another appropriate multiplayer service).
4. Add Firebase Authentication and Firestore saves. Keep rewards and competitive outcomes server-validated; do not trust client-side coin/XP updates.

## Honest limitations
This is a single-player prototype. It does not currently implement online multiplayer, real flight simulation, Firebase persistence, or production-grade physics. The turbulence and passenger behaviors are lightweight scripted effects. The game is an original homage to the broad comedic airplane-crew concept, not a copy of proprietary assets or code.
