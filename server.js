const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '5mb' }));

const publicDir = path.join(__dirname, 'public');

app.use(
  express.static(publicDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
      } else if (filePath.endsWith('.gltf')) {
        res.setHeader('Content-Type', 'model/gltf+json');
      }
    },
  })
);

// In-memory Leaderboard & Multiplayer Room State
const leaderboards = {
  'wro-beacon-sprint': [
    { id: 'seed-1', playerName: 'SpikePrime_VN', robotName: 'LEGO Spike Prime WRO', timeMs: 14820, score: 500, mode: 'single', date: '2026-10-22' },
    { id: 'seed-2', playerName: 'EV3_Master', robotName: 'Mindstorms EV3 Pro', timeMs: 17450, score: 500, mode: 'single', date: '2026-10-22' }
  ],
  'fll-magnetic-rescue': [
    { id: 'seed-3', playerName: 'FLL_AllStars', robotName: 'LEGO Spike Prime WRO', timeMs: 21340, score: 650, mode: 'single', date: '2026-10-22' }
  ],
  'spike-claw-logistics': [
    { id: 'seed-4', playerName: 'RoboLab_01', robotName: 'LEGO Spike Prime WRO', timeMs: 24900, score: 700, mode: 'single', date: '2026-10-22' }
  ],
  'wro-pid-line-master': [
    { id: 'seed-5', playerName: 'PID_Wizard', robotName: 'LEGO Spike Prime WRO', timeMs: 12610, score: 600, mode: 'single', date: '2026-10-22' }
  ],
  'team-relay-marathon': [
    { id: 'seed-6', playerName: 'Team Alpha & Beta', robotName: 'Spike Prime Relay', timeMs: 28100, score: 800, mode: 'relay', date: '2026-10-22' }
  ]
};

app.get('/api/leaderboard', (req, res) => {
  const { challengeId } = req.query;
  if (challengeId && leaderboards[challengeId]) {
    return res.json(leaderboards[challengeId]);
  }
  res.json(leaderboards);
});

app.post('/api/leaderboard', (req, res) => {
  const { challengeId, playerName, robotName, timeMs, score, mode } = req.body || {};
  if (!challengeId || typeof timeMs !== 'number') {
    return res.status(400).json({ error: 'Invalid leaderboard entry' });
  }
  if (!leaderboards[challengeId]) {
    leaderboards[challengeId] = [];
  }
  const entry = {
    id: 'run-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    playerName: String(playerName || 'Anonymous Bot').slice(0, 32),
    robotName: String(robotName || 'Custom Robot').slice(0, 40),
    timeMs: Math.max(100, Math.round(timeMs)),
    score: Number(score) || 0,
    mode: mode || 'single',
    date: new Date().toISOString().slice(0, 10)
  };
  leaderboards[challengeId].push(entry);
  leaderboards[challengeId].sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
  leaderboards[challengeId] = leaderboards[challengeId].slice(0, 25);
  res.json({ ok: true, entry, leaderboard: leaderboards[challengeId] });
});

// Authoritative WebSocket Rooms for Duel & Team Relay
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function serializeRoom(room) {
  return {
    roomCode: room.roomCode,
    mode: room.mode,
    challengeId: room.challengeId,
    status: room.status,
    activeRelayStage: room.activeRelayStage,
    startTimeMs: room.startTimeMs,
    elapsedMs: room.status === 'running' ? Date.now() - room.startTimeMs : room.elapsedMs,
    SharedCheckpoints: Array.from(room.sharedCheckpoints),
    players: Array.from(room.players.values()).map((p) => ({
      clientId: p.clientId,
      name: p.name,
      slot: p.slot,
      robotTemplate: p.robotTemplate,
      color: p.color,
      ready: p.ready,
      stageComplete: p.stageComplete,
      checkpointsCleared: p.checkpointsCleared,
      score: p.score,
      pose: p.pose,
      hasCode: Boolean(p.pythonCode)
    }))
  };
}

function broadcastToRoom(room, payload, excludeClientId = null) {
  const msg = JSON.stringify(payload);
  for (const player of room.players.values()) {
    if (player.clientId !== excludeClientId && player.ws.readyState === 1) {
      player.ws.send(msg);
    }
  }
}

const SLOT_COLORS = ['#06B6D4', '#F59E0B', '#10B981', '#EC4899'];

wss.on('connection', (ws) => {
  const clientId = 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  let currentRoomCode = null;

  ws.send(JSON.stringify({ type: 'connected', clientId }));

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (data.type === 'create_room') {
      let roomCode = generateRoomCode();
      while (rooms.has(roomCode)) {
        roomCode = generateRoomCode();
      }
      const room = {
        roomCode,
        mode: data.mode === 'duel' ? 'duel' : 'relay',
        challengeId: data.challengeId || 'team-relay-marathon',
        status: 'lobby',
        activeRelayStage: 0,
        startTimeMs: 0,
        elapsedMs: 0,
        sharedCheckpoints: new Set(),
        players: new Map()
      };
      const player = {
        clientId,
        ws,
        name: String(data.playerName || 'Player 1').slice(0, 24),
        slot: 0,
        robotTemplate: data.robotTemplate || 'spikePrimeWRO',
        color: SLOT_COLORS[0],
        ready: true,
        stageComplete: false,
        checkpointsCleared: 0,
        score: 0,
        pythonCode: data.pythonCode || '',
        pose: { x: 0, y: 2, z: 0, rotY: 0, armAngle: 0, clawClosed: false, magnetOn: false }
      };
      room.players.set(clientId, player);
      rooms.set(roomCode, room);
      currentRoomCode = roomCode;
      ws.send(JSON.stringify({ type: 'room_joined', room: serializeRoom(room), clientId, slot: 0 }));
      return;
    }

    if (data.type === 'join_room') {
      const code = String(data.roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) {
        ws.send(JSON.stringify({ type: 'room_error', message: 'Không tìm thấy mã phòng: ' + code }));
        return;
      }
      const usedSlots = new Set(Array.from(room.players.values()).map((p) => p.slot));
      let assignedSlot = 0;
      while (usedSlots.has(assignedSlot) && assignedSlot < 4) {
        assignedSlot++;
      }
      if (assignedSlot >= 4) {
        ws.send(JSON.stringify({ type: 'room_error', message: 'Phòng đã đầy (tối đa 4 robot).' }));
        return;
      }
      const player = {
        clientId,
        ws,
        name: String(data.playerName || 'Player ' + (assignedSlot + 1)).slice(0, 24),
        slot: assignedSlot,
        robotTemplate: data.robotTemplate || 'spikePrimeWRO',
        color: SLOT_COLORS[assignedSlot % SLOT_COLORS.length],
        ready: true,
        stageComplete: false,
        checkpointsCleared: 0,
        score: 0,
        pythonCode: data.pythonCode || '',
        pose: { x: 0, y: 2, z: 0, rotY: 0, armAngle: 0, clawClosed: false, magnetOn: false }
      };
      room.players.set(clientId, player);
      currentRoomCode = code;
      ws.send(JSON.stringify({ type: 'room_joined', room: serializeRoom(room), clientId, slot: assignedSlot }));
      broadcastToRoom(room, { type: 'room_state', room: serializeRoom(room) }, clientId);
      return;
    }

    if (!currentRoomCode || !rooms.has(currentRoomCode)) {
      return;
    }
    const room = rooms.get(currentRoomCode);
    const player = room.players.get(clientId);
    if (!player) return;

    switch (data.type) {
      case 'configure_room': {
        if (data.mode === 'duel' || data.mode === 'relay') {
          room.mode = data.mode;
        }
        if (data.challengeId) {
          room.challengeId = data.challengeId;
        }
        broadcastToRoom(room, { type: 'room_state', room: serializeRoom(room) });
        break;
      }

      case 'update_player': {
        if (typeof data.slot === 'number' && data.slot >= 0 && data.slot < 4) {
          player.slot = data.slot;
          player.color = SLOT_COLORS[player.slot % SLOT_COLORS.length];
        }
        if (typeof data.name === 'string' && data.name.trim()) {
          player.name = data.name.trim().slice(0, 24);
        }
        if (typeof data.robotTemplate === 'string') {
          player.robotTemplate = data.robotTemplate;
        }
        if (typeof data.pythonCode === 'string') {
          player.pythonCode = data.pythonCode;
        }
        if (typeof data.ready === 'boolean') {
          player.ready = data.ready;
        }
        broadcastToRoom(room, { type: 'room_state', room: serializeRoom(room) });
        break;
      }

      case 'start_match': {
        room.status = 'running';
        room.activeRelayStage = 0;
        room.startTimeMs = Date.now();
        room.elapsedMs = 0;
        room.sharedCheckpoints.clear();
        for (const p of room.players.values()) {
          p.stageComplete = false;
          p.checkpointsCleared = 0;
          p.score = 0;
        }
        broadcastToRoom(room, {
          type: 'match_started',
          room: serializeRoom(room),
          activeRelayStage: room.activeRelayStage,
          startTimeMs: room.startTimeMs
        });
        break;
      }

      case 'stop_match': {
        room.status = 'lobby';
        room.elapsedMs = room.startTimeMs ? Date.now() - room.startTimeMs : 0;
        broadcastToRoom(room, {
          type: 'match_stopped',
          room: serializeRoom(room)
        });
        break;
      }

      case 'pose_update': {
        if (data.pose && typeof data.pose.x === 'number') {
          player.pose = {
            x: data.pose.x,
            y: data.pose.y || 2,
            z: data.pose.z,
            rotY: data.pose.rotY || 0,
            armAngle: data.pose.armAngle || 0,
            clawClosed: Boolean(data.pose.clawClosed),
            magnetOn: Boolean(data.pose.magnetOn)
          };
          broadcastToRoom(
            room,
            {
              type: 'remote_pose',
              clientId,
              slot: player.slot,
              name: player.name,
              color: player.color,
              pose: player.pose
            },
            clientId
          );
        }
        break;
      }

      case 'checkpoint_cleared': {
        const cpNumber = Number(data.checkpointNumber);
        if (!room.sharedCheckpoints.has(`${player.slot}:${cpNumber}`)) {
          room.sharedCheckpoints.add(`${player.slot}:${cpNumber}`);
          player.checkpointsCleared += 1;
          player.score += Number(data.points) || 100;
          broadcastToRoom(room, {
            type: 'checkpoint_event',
            clientId,
            slot: player.slot,
            playerName: player.name,
            checkpointNumber: cpNumber,
            score: player.score,
            room: serializeRoom(room)
          });
        }
        break;
      }

      case 'relay_stage_complete': {
        if (room.mode === 'relay' && player.slot === room.activeRelayStage) {
          player.stageComplete = true;
          const slots = Array.from(room.players.values())
            .map((p) => p.slot)
            .sort((a, b) => a - b);
          const nextSlot = slots.find((s) => s > room.activeRelayStage);
          if (typeof nextSlot === 'number') {
            room.activeRelayStage = nextSlot;
            broadcastToRoom(room, {
              type: 'relay_handoff',
              previousSlot: player.slot,
              activeRelayStage: room.activeRelayStage,
              elapsedMs: Date.now() - room.startTimeMs,
              room: serializeRoom(room)
            });
          } else {
            room.status = 'finished';
            room.elapsedMs = Date.now() - room.startTimeMs;
            broadcastToRoom(room, {
              type: 'match_finished',
              winnerName: 'Team Relay',
              elapsedMs: room.elapsedMs,
              room: serializeRoom(room)
            });
          }
        } else if (room.mode === 'duel') {
          player.stageComplete = true;
          room.status = 'finished';
          room.elapsedMs = Date.now() - room.startTimeMs;
          broadcastToRoom(room, {
            type: 'match_finished',
            winnerName: player.name,
            winnerSlot: player.slot,
            elapsedMs: room.elapsedMs,
            room: serializeRoom(room)
          });
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && rooms.has(currentRoomCode)) {
      const room = rooms.get(currentRoomCode);
      room.players.delete(clientId);
      if (room.players.size === 0) {
        rooms.delete(currentRoomCode);
      } else {
        broadcastToRoom(room, { type: 'room_state', room: serializeRoom(room) });
      }
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

server.listen(PORT, HOST, () => {
  console.log(`GearsBot WRO/FLL Server + WebSocket running at http://${HOST}:${PORT}`);
});
