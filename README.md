# METAL SLUG: REBEL COMBAT — 2-Player Co-op Arcade Run & Gun

An authentic arcade side-scrolling run & gun shooter inspired by the classic **Metal Slug** series, built with vanilla HTML5, Canvas, and Web Audio API.

## Live Review Link
- **Production URL**: [https://app-seven-orpin-24.vercel.app](https://app-seven-orpin-24.vercel.app)
- **Preview Deployment**: Deployed on Vercel with instant HTTP 200 delivery.

---

## Features
- **2-Player Local Co-op**: Play together on a single screen with Marco Rossi (P1) and Tarma Roving (P2). Solo mode is also available.
- **4 Action-Packed Stages / Missions**:
  - **Mission 1**: Jungle Canal & Rebel Outpost (Boss: Tetsuyuki River Battleship)
  - **Mission 2**: Arabian Desert & Ancient Ruins (SV-001 Metal Slug Tank available, Boss: Iron Nokana Siege Fortress)
  - **Mission 3**: Frozen Front & Railway Fortress (Blizzards, Gunships, Boss: Hi-Do General's Chopper)
  - **Final Mission**: Underground Bio-Core (Laser barriers, elite troops, Final Boss: The Jupiter King)
- **Iconic Metal Slug Vehicles**:
  - **SV-001 Metal Slug Tank**: Boardable combat tank equipped with twin rotating vulcan cannons, 120mm armor-piercing cannon shells, armored plating, jumping treads, and emergency eject!
- **Arsenal**:
  - Handgun / Pistol (unlimited ammo)
  - Heavy Machine Gun [H] (rapid-fire 150 rounds with angular bullet spray)
  - Shotgun [S] (devastating wide spread obliterating enemies)
  - Rocket Launcher [R] (tracking self-propelled high-explosive rockets)
  - Flame Shot [F] (rolling fireball engulfing enemy lines)
  - Laser Gun [L] (piercing continuous energy beam)
  - Pineapple Grenades (bouncing high-explosive area blast)
- **Close-Combat Melee Knife Slash**:
  - Close-range attacks automatically trigger the combat knife slash for instant takedowns and **+500 KNIFE BONUS** points!
- **Rescuable POWs (Hostages)**:
  - Liberate bearded hostages tied up in enemy territory; rescued POWs salute with a "THANK YOU!" and drop weapon crates, bomb packs, or medals.
- **Enemies & Combatants**:
  - Rebel Infantry Grunts (rifles & stick grenades)
  - Knife Rushers (fast melee sprint)
  - Shield Soldiers (bulletproof riot shields requiring flanking or explosives)
  - Bazooka Troopers (rocket artillery)
  - Flying Tara Attack Helicopters (strafing runs and bomb drops)
- **Audio & Neo-Geo Arcade Voice Announcer**:
  - Procedural Web Audio API sound effects: gunfire, explosions, alarm sirens, tank engine rumble, and victory jingles.
  - Voice announcements: *"Mission 1 Start!"*, *"Heavy Machine Gun!"*, *"Shotgun!"*, *"Rocket Launcher!"*, *"Flame Shot!"*, *"Laser Gun!"*, *"Thank You!"*, *"Mission Complete!"*, *"Game Over!"*
- **Controls**:
  - **1P (Marco)**: `W`/`A`/`S`/`D` to Move/Aim/Crouch, `J` to Shoot/Slash, `K` or `Space` to Jump/Board Slug, `L` to Throw Bomb.
  - **2P (Tarma)**: Arrow Keys to Move/Aim/Crouch, `/` or `Z` to Shoot/Slash, `Enter` or `X` to Jump/Board Slug, `.` or `C` to Throw Bomb.
  - **Gamepads**: Supports up to 2 USB / Bluetooth gamepads simultaneously.
  - **Touch Screens**: Sleek on-screen D-pad and action buttons for phones & tablets.
  - **CRT Scanline Filter**: Toggleable vintage arcade CRT scanlines overlay.

---

## Deployment

Deploy directly to Vercel:
```powershell
vercel deploy --token $env:VERCEL_TOKEN --scope app-d14d --project app --prod --yes
```

Push to GitHub:
```powershell
git push origin main
```
