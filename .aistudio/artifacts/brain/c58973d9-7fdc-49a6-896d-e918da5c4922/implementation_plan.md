# GearsBot WRO / FLL Competition & Performance Suite

An upgraded educational and competitive 3D robotics simulation suite built on GearsBot, delivering low-spec hardware optimization, rule-driven WRO/FLL Challenge missions with glowing numbered beacons and cargo manipulation, real-time WebSocket multiplayer (Duel & Team Relay), realistic LEGO Spike Prime / EV3 physics calibration, custom 3D GLB/GLTF mechanism building, and live PID/Odometry telemetry.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and product choices have been confirmed from your answers and are locked in for implementation upon approval:

- **Confirmed Decision 1 — Real-Time Multiplayer & Duel Architecture**: WebSocket Room Code synchronization supporting both **Head-to-Head Duel Mode** (2–4 robots competing simultaneously on the same arena) and **Team Relay Mode** (each team member programs a robot for a specific stage; Robot $N+1$ unlocks automatically when Robot $N$ completes its stage checkpoint/handoff zone).
- **Confirmed Decision 2 — Dynamic Challenge Rule Engine**: Each Challenge preset defines its own rule schema (sequential or free-order glowing numbered checkpoints, required cargo pick-up and drop-off zones using Claw/Electromagnet, out-of-bounds/collision penalties, and count-up/countdown timers with automatic mission verification).
- **Confirmed Decision 3 — LEGO Spike Prime & Mindstorms EV3 Ecosystem + Custom GLB Builder**: Pre-calibrated competition templates for LEGO Spike Prime and Mindstorms EV3 (with dual color sensors, ultrasonic/laser rangefinders, gyro, motorized claw, and electromagnet), combined with an interactive Mechanism Configurator & GLB/GLTF 3D model importer.
- **Confirmed Decision 4 — Advanced Competition & Learning Tools**: Full integration of **Live PID & Sensor Telemetry Graph**, **3D Robot Path Trail & Odometry Visualizer**, **Low-Spec Performance Switcher (Ultra-Low / Balanced / High)**, and **Ghost Robot Replay & Local Leaderboard**.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms GearsBot into a high-efficiency, competition-grade robotics training platform where students and teams can program LEGO Spike Prime and Mindstorms EV3 robots (via Blockly or Python `ev3dev2` / `pybricks`), execute PID line-following and sensor-guided cargo manipulation across glowing numbered checkpoints, analyze real-time control loops, and collaborate or compete live in WebSocket rooms.
- **Target Audience / Persona**: WRO (World Robot Olympiad) and FLL (FIRST LEGO League) students, coaches, STEM educators, and robotics clubs operating on diverse hardware—including low-spec school laptops with integrated graphics.
- **Key Value**: Bridges the gap between basic block coding and real-world robotics competitions by pairing deterministic, realistic physics and PID telemetry with low-resource WebGL optimization and real-time multi-robot team coordination.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Performance Preset & Robot Selection**: From the simulator toolbar, users can switch hardware profiles (`Low-Spec 60FPS`, `Balanced`, `High Quality`) with a single click and select or customize a **LEGO Spike Prime Competition Bot** or **Mindstorms EV3 Pro Bot** (or import custom `.glb`/`.gltf` mechanism parts).
  2. **Challenge Mission Briefing & Execution**: Selecting **Challenge Mode** opens the Mission Selector (e.g., *WRO PID Line & Beacon Run*, *FLL Magnetic Cargo Rescue*, *Spike Prime Claw Logistics*, *Team Relay Marathon*). The 3D arena renders glowing numbered light pillars (`1`, `2`, `3`...), target cargo blocks, and drop-off base zones, alongside a floating HUD displaying elapsed time, checkpoint progress, and live score.
  3. **Programming & PID Tuning**: Users write or load a PID controller in Blockly or Python. While the robot runs, the collapsible **Live Telemetry & PID Oscilloscope** plots real-time error $e(t)$, proportional/integral/derivative terms, color sensor reflectance, and wheel speeds, while a color-coded **3D Path Trail** traces the robot's trajectory on the mat.
  4. **Ghost Replay & Leaderboard**: Upon crossing the final checkpoint or delivering all cargo, the timer stops, records the run to the Challenge Leaderboard, and allows toggling a translucent **Ghost Robot** of the fastest run on subsequent attempts.
  5. **Real-Time Multiplayer (Duel & Relay)**: Clicking **Multiplayer Room** lets a user create or join a 6-character Room Code, pick their role (`Duel Slot 1–4` or `Relay Stage 1–4`), sync their Python/Blockly program to the room, and watch all robots execute in real time with automatic relay handoffs.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Precision Robotics Lab & Competition Telemetry HUD—clean, high-contrast functional panels layered unobtrusively over the 3D WebGL stage without blocking the arena view.
  - *Color Palette & Mood (60-30-10 Allocation)*:
    - **60% Dominant Stage & Workspace**: Crisp neutral workspace panels and deep slate 3D viewport surround (`#0F172A` dark HUD surfaces / `#F8FAFC` light editor surfaces).
    - **30% Structural Surfaces & Borders**: Frosted translucent HUD overlays (`rgba(15, 23, 42, 0.78)` with `backdrop-filter: blur(8px)`) and subtle `1px solid rgba(255, 255, 255, 0.12)` dividers.
    - **10% Semantic Competition Accents**:
      - Active / Next Checkpoint Beacon: Electric Cyan (`#06B6D4`) with numbered holographic floating label
      - Completed Checkpoint / Nominal State: Emerald Green (`#10B981`) paired with explicit `✓ CLEARED` text
      - Cargo Target / LEGO Spike Prime Accent: Competition Amber (`#F59E0B`)
      - Penalty / High Error / EV3 Accent: Racing Coral Red (`#EF4444`)
  - *Typography & Hierarchy*:
    - **Display & UI Headers**: `Plus Jakarta Sans` (SemiBold 600) for clean, readable panel headers and mission titles.
    - **Body & Controls**: `DM Sans` (Regular 400 / Medium 500) for compact, single-line toolbar buttons and mission rules.
    - **Timers, Scorecards, Odometry & Code**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` so millisecond timers, $(X, Y, \theta)$ coordinates, and PID values never jitter horizontally.
  - *Component Styling & Spatial Math*:
    - Floating 3D HUD overlays use `16px` outer padding, `8px` internal item gaps, and compact single-line controls (`whitespace-nowrap`) anchored to the top-left (Challenge HUD) and bottom-right (Telemetry & Trail Drawer) of the simulator canvas so the center viewport remains 100% unobstructed.

- **Interactive Feedback & Motion**:
  - When a robot enters a numbered checkpoint pillar's radius, the pillar transitions smoothly from cyan to emerald, plays a visual pulse ring on the mat, and increments the HUD counter.
  - Activating the Electromagnet or closing the Motorized Claw displays an active force-field ring or grip indicator on the actuator and highlights captured cargo.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Multi-Tier Low-Spec Performance Engine vs. Fixed Rendering**
  - *Chosen Approach*: Implement a dynamic 3-tier Performance Manager (`Low-Spec`, `Balanced`, `High`) plus automatic FPS watchdog fallback. In `Low-Spec` mode, shadow maps (`ShadowGenerator`), post-processing, and antialiasing are disabled, hardware scaling is set to `1.5x–2.0x`, mesh materials are frozen, static world obstacles are merged/frozen into octrees, and Color Sensor RenderTargetTexture (RTT) readPixels calls are throttled from every frame to a configurable tick rate (`15–20 Hz`) with smaller `16x16` RTT buffers.
  - *Why*: `readPixels` on WebGL RenderTargetTextures and dynamic shadow maps are the #1 bottleneck on integrated GPUs. Throttling sensor RTT and disabling shadows reduces GPU/CPU load by over 65% while preserving accurate PID line-following.
  - *Alternatives Considered*: Rewriting Babylon.js to Three.js—rejected because migrating 40+ robotics/physics files would risk breaking existing EV3/Pybricks API compatibility without solving the underlying WebGL `readPixels` and Ammo.js sub-step costs.

- **Decision 2 — Hybrid Authoritative Room Sync for Multiplayer (Duel & Relay)**
  - *Chosen Approach*: Attach a `ws` WebSocket server to the existing Express server on port `3000`. Rooms manage player slots, robot configurations, shared challenge state (active checkpoint, baton stage, match timer), and throttled kinematic state snapshots (`20 Hz` position, quaternion, wheel velocities, actuator state) with client-side linear/spherical interpolation (`lerp`/`slerp`).
  - *Why*: Running full Ammo.js WASM physics on the Node.js server for 4 robots would introduce input lag for local Skulpt Python execution. Having each player's browser execute their own Skulpt Python loop and stream kinematic + mission events through the server room guarantees zero-latency sensor readings for local PID loops while keeping all connected browsers synchronized.
  - *Alternatives Considered*: Pure iframe local-only Arena (`arena.html`)—preserved for single-machine testing, but extended with real WebSocket Room synchronization so teammates on different computers can collaborate in Relay or compete in Duel mode.

- **Decision 3 — Realistic Physics Calibration & LEGO Spike Prime / EV3 Profiles**
  - *Chosen Approach*: Upgrade `Wheel.js`, `Robot.js`, and `robotComponents.js` with calibrated mass distribution, center-of-mass (CoM) lowering, realistic tire lateral/longitudinal friction curves, motor torque-speed saturation, encoder backlash/noise options, and true 3-finger/2-finger Parallel Gripper + Electromagnet magnetic attraction physics.
  - *Why*: In the default simulator, robots can tip over during sharp braking or jump walls when backing up, and claws rely on simplistic single-hinge collision. Calibrated inertia tensors and magnetic/gripper constraints make virtual robots behave like physical LEGO Spike Prime and EV3 kits.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER (GearsBot Workspace)                      │
├───────────────────────┬──────────────────────────┬───────────────────────────┤
│   Programming Suite   │   3D Simulation Engine   │  Competition & Telemetry  │
│ ┌───────────────────┐ │ ┌──────────────────────┐ │ ┌───────────────────────┐ │
│ │ Blockly + Custom  │ │ │ Babylon.js + Ammo.js │ │ │ Challenge Rule Engine │ │
│ │ PID / Claw Blocks │ │ │ Physics & CoM Tuning │ │ │ (Beacons, Cargo, Time)│ │
│ └─────────┬─────────┘ │ └──────────┬───────────┘ │ └───────────┬───────────┘ │
│           ▼           │            │             │             │             │
│ ┌───────────────────┐ │ ┌──────────┴───────────┐ │ ┌───────────┴───────────┐ │
│ │ Ace Python Editor │ │ │ Low-Spec Optimizer   │ │ │ Live PID Oscilloscope │ │
│ │ & Skulpt Runtime  ├─┼─► (RTT Throttle, Mesh  │ │ │ + 3D Odometry Trail   │ │
│ │ (ev3dev/pybricks) │ │ │  Freeze, Shadow Off) │ │ │ + Ghost Replay Engine │ │
│ └───────────────────┘ │ └──────────┬───────────┘ │ └───────────┬───────────┘ │
│                       │            │             │             │             │
│ ┌───────────────────┐ │ ┌──────────┴───────────┐ │ ┌───────────┴───────────┐ │
│ │ Spike Prime / EV3 │ │ │ Custom GLB/GLTF      │ │ │ Multiplayer Room UI   │ │
│ │ Template Library  ├─┼─► Mechanism & Actuator │ │ │ (Duel & Team Relay)   │ │
│ └───────────────────┘ │ │ Builder              │ │ └───────────┬───────────┘ │
└───────────────────────┴────────────┴─────────────┴─────────────┼─────────────┘
                                                                 │ WebSocket
                                                                 ▼ (Port 3000)
┌──────────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS + WEBSOCKET SERVER (server.js)                     │
├────────────────────────────────────┬─────────────────────────────────────────┤
│ Static & Asset Delivery            │ Real-Time Room & Match Coordinator      │
│ • Serves public/, .wasm, .glb      │ • Room Registry (6-char Room Codes)     │
│ • Built-in Sample PID & WRO Maps   │ • Duel & Relay Baton State Machine      │
│ • REST API (/api/leaderboard)      │ • 20Hz Kinematic & Event Broadcast      │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

- **Data Model & State**:
  - **PerformanceConfig**: `{ tier: 'low' | 'balanced' | 'high', shadowsEnabled: boolean, hardwareScaling: number, sensorRttHz: number, physicsSubSteps: number, trailEnabled: boolean }`.
  - **ChallengeDefinition**: `{ id, title, category: 'WRO' | 'FLL' | 'Relay', timeLimitSec, sequentialCheckpoints: boolean, checkpoints: [{ id, number, pos: [x,y,z], radius, requiredCargoId? }], cargoItems: [{ id, type: 'magnetic' | 'graspable', startPos, points }], dropZones: [{ id, pos, size, acceptedCargoIds }], penalties: { outOfBoundsSec, obstacleHitSec } }`.
  - **TelemetryFrame**: `{ timestampMs, pose: { x, z, headingDeg }, wheelSpeeds: { left, right }, colorSensor: { reflected, rgb, hsv }, pid: { target, actual, error, pTerm, iTerm, dTerm, output } }`.
  - **GhostRunRecord**: `{ challengeId, playerName, totalTimeMs, score, frames: [{ t, x, z, rotY, armPos }] }` persisted in `localStorage` and server-side `/api/leaderboard`.
  - **MultiplayerRoomState**: `{ roomCode, mode: 'duel' | 'relay', challengeId, status: 'lobby' | 'running' | 'finished', activeRelayStage: number, startTimeMs, players: Map<clientId, { slot, name, robotTemplate, ready, pose, checkpointsCleared, stageComplete }> }`.

- **Interactive Component & State Mapping**:
  - **Low-Spec Performance Switcher**: Selecting `Low-Spec` immediately disposes `scene.shadowGenerator`, sets `engine.setHardwareScalingLevel(1.75)`, switches all static ground/wall meshes to `freezeWorldMatrix()`, and adjusts the Color Sensor RTT update interval to `50ms` (`20 Hz`).
  - **Challenge Mode Controller**:
    - Spawns 3D glowing numbered cylinders (`BABYLON.MeshBuilder.CreateCylinder` with emissive material and dynamic 3D number planes) at each checkpoint coordinate.
    - Runs a deterministic check on every simulation tick (`50ms`): validates whether the robot's bounding center enters the active checkpoint radius, whether magnetic/claw cargo is inside a drop-off zone, and updates the live timer and scorecard.
  - **Claw & Electromagnet Mechanisms**:
    - *Electromagnet (`MagnetActuator`)*: Exposes Python power control (`on_for_rotations` / `on(power)`) that projects a configurable magnetic attraction cone; magnetic cargo items within range experience a smooth spring-damper attraction force before locking to the magnet mount, and release cleanly when power is set to `0`.
    - *Parallel Claw / Gripper (`ClawActuator`)*: Synchronized dual-jaw actuator driven by a single motor port (`outC` or `outD`) that physically pinches and locks graspable objects when closed around them, preventing physics jitter during transport.
  - **PID & Navigation Templates**:
    - Provides ready-to-load Blockly & Python starter templates for **1-Sensor & 2-Sensor PID Line Following**, **Gyro Straight & Turn PID**, and **Checkpoint Waypoint Navigation**, plus a Python helper `gears_telemetry.log_pid(error, p, i, d, output)` (and automatic sensor hook) that feeds the live oscilloscope chart.
  - **LEGO Spike Prime & EV3 Builder + GLB Importer**:
    - Adds dedicated **LEGO Spike Prime (Cyan/Yellow/Magenta Hub, Medium Angular Wheels, Force/Distance/Color Sensors, Parallel Claw)** and **LEGO Mindstorms EV3 (Educator Vehicle, Dual-Color WRO Bot, Magnet Collector Bot)** templates.
    - Enhances the Robot Configurator with a local `.glb`/`.gltf` file uploader (`FileReader` -> `BABYLON.SceneLoader.AppendAsync` via Blob URL) so users can attach custom 3D chassis or mechanism meshes to any robot component slot with custom scale, offset, and mass.
  - **Real-Time Duel & Relay Synchronization**:
    - In **Duel Mode**, when the host clicks **Start Match**, the server broadcasts `match:start` with a synchronized timestamp; all players' robots execute simultaneously on the shared arena, and each client renders remote robots at `20 Hz` with smooth interpolation.
    - In **Relay Mode**, Stage 1's robot starts at the launch zone while Stages 2..N wait at their relay handoff zones. As soon as Robot 1 reaches Relay Zone 1 (or delivers the baton cargo into Relay Zone 1), the server broadcasts `relay:handoff { stage: 2 }`, automatically triggering Player 2's Python/Blockly program in real time until the final robot crosses the finish line.
