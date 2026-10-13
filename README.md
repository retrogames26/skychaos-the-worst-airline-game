# Sky Chaos — Worst Airline Simulator (Prototype 0.2)

A browser-playable, first-person 3D airplane crew game built with Three.js and Vite. The art is generated from original procedural geometry; no Dear Passengers proprietary assets or code are used.

## New in prototype 0.2
- Starts outside the plane on an airport apron, with a full stylized airliner, nose, cockpit glazing, swept wings, engines, tail, windows, landing gear, terminal, runway, ground vehicles, baggage belt and boarding stairs.
- Press **E** at the boarding stairs to enter the cutaway cabin.
- Seven preflight duties: verify passenger tickets, load baggage, secure dangerous cargo, prepare meals, clean a cabin spill, make a PA announcement, and secure the cabin door.
- Press **E** near the cockpit when the checklist is complete to take the pilot seat.
- Flight controls: **W/S** pitch, **A/D** bank/roll, **Shift** increase throttle, **Ctrl** reduce throttle, **E** exit the pilot seat.
- Walk controls outside the pilot seat: **W/A/S/D**, mouse look, **Shift** run, **E** interact, **Esc** releases mouse capture.
- Flight phases include taxi, takeoff, airborne cruise, approach, and a simple landing sequence.
- Task checklist, cash rewards, passenger mood, altitude and flight status HUD.

## Run locally
Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL Vite prints. Click **START AT THE AIRPORT**, use WASD and mouse to move, and press E at the highlighted duty markers. After completing all preflight duties, enter the cabin, walk forward to the cockpit and press E to pilot.

Build for production:

```bash
npm run build
npm run preview
```

Static production files are generated in `dist/`.

## Deploy to GitHub + Cloudflare Pages
1. Create a GitHub repository and upload the contents of this folder.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy.

No server or environment variables are required for this prototype.

## Controls
- **On foot:** WASD move, mouse look, Shift run, E interact/board/exit.
- **At cockpit:** E enter/exit pilot seat. W/S pitch, A/D roll, Shift/Ctrl throttle.
- **R:** reset current shift.
- **Esc:** release mouse capture.

## Known limitations
This is an early single-player prototype, not a finished flight simulator. Character animation, robust collision/physics, true aircraft aerodynamic simulation, realistic loading animations, online multiplayer and Firebase save data are not implemented yet. The cockpit flight model is a simple gameplay approximation. A real online co-op release needs an authoritative multiplayer server; Cloudflare Pages alone only hosts the web client.
