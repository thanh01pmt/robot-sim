/* global BABYLON, babylon, robot, robots, robotTemplates, worlds, simPanel, main, filesManager, pythonPanel, blocklyPanel, skulpt, toastMsg, i18n, LANG, menuDropDown, dialog */

// 1. Register full Vietnamese (vi) & English (en) translations so Top Bar & UI are 100% language-consistent
if (typeof i18n !== 'undefined' && typeof i18n.append === 'function') {
  i18n.append({
    '#main-blocks#': { en: 'Blocks', vi: 'Khối lệnh' },
    '#main-sim#': { en: 'Simulator', vi: 'Mô phỏng' },
    '#main-file#': { en: 'File', vi: 'Tệp' },
    '#main-robot#': { en: 'Robot', vi: 'Robot' },
    '#main-worlds#': { en: 'Worlds', vi: 'Sa bàn' },
    '#main-help#': { en: 'Help', vi: 'Trợ giúp' },
    '#main-main#': { en: 'Main', vi: 'Chính' },
    '#main-competition#': { en: 'Competition', vi: 'Thi đấu' },
    '#main-select_robot#': { en: 'Select Robot', vi: 'Chọn mẫu Robot' },
    '#main-robot_configurator#': { en: 'Robot Configurator', vi: 'Thiết kế Robot 3D' },
    '#main-robot_load_file#': { en: 'Load from file', vi: 'Tải Robot từ tệp' },
    '#main-robot_save_file#': { en: 'Save to file', vi: 'Lưu Robot ra tệp' },
    '#main-display_position#': { en: 'Display current position', vi: 'Xem tọa độ hiện tại' },
    '#main-save_position#': { en: 'Save current position to settings', vi: 'Lưu vị trí xuất phát' },
    '#main-clear_position#': { en: 'Clear position in settings', vi: 'Xóa vị trí đã lưu' },
    '#main-select_world#': { en: 'Select World', vi: 'Chọn Sa bàn' },
    '#main-world_builder#': { en: 'World Builder', vi: 'Thiết kế Sa bàn' },
    '#main-arena#': { en: 'Multi-Robot Arena', vi: 'Đấu trường 4 Robot' },
    '#main-world_load_file#': { en: 'Load world from file', vi: 'Tải Sa bàn từ tệp' },
    '#main-world_save_file#': { en: 'Save world to file', vi: 'Lưu Sa bàn ra tệp' },
    '#main-new_program#': { en: 'New Program', vi: 'Chương trình mới' },
    '#main-load_blocks#': { en: 'Load blocks from your computer', vi: 'Mở tệp Khối lệnh' },
    '#main-import_functions#': { en: 'Import functions from blocks file', vi: 'Nhập hàm từ tệp' },
    '#main-save_blocks#': { en: 'Save blocks to your computer', vi: 'Lưu Khối lệnh về máy' },
    '#main-load_python#': { en: 'Load Python from your computer', vi: 'Mở tệp Python' },
    '#main-save_python#': { en: 'Save Python to your computer', vi: 'Lưu Python về máy' },
    '#main-export_zip#': { en: 'Export zip package to your computer', vi: 'Xuất gói dự án (.zip)' },
    '#main-import_zip#': { en: 'Import zip package from your computer', vi: 'Nhập gói dự án (.zip)' }
  });
}

var wroSuite = new (function() {
  var self = this;

  this.isVi = function() {
    return typeof LANG !== 'undefined' && LANG === 'vi';
  };

  this.t = function(enText, viText) {
    return self.isVi() ? viText : enText;
  };

  // Challenge Definitions (START Zone -> Checkpoints #1..#N -> END Zone)
  this.challenges = [
    {
      id: 'wro-beacon-sprint',
      titleEn: '1. WRO Beacon Navigation (START → 1..5 → END)',
      titleVi: '1. WRO Cột Sáng Định Tuyến (START → 1..5 → END)',
      worldName: 'grid',
      recommendedRobot: 'spikePrimeWRO',
      sequential: true,
      timeLimitSec: 90,
      descEn: 'Depart from START (0, 0), navigate sequentially through Beacons #1 → #5, and finish at END (0, -40).',
      descVi: 'Xuất phát từ điểm START (0, 0), điều khiển Robot đi qua lần lượt 5 Cột Sáng (#1 → #5) và về đích tại điểm END (0, -40).',
      startZone: { pos: [0, 0], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' },
      checkpoints: [
        { number: 1, pos: [0, 35], radius: 11, points: 100 },
        { number: 2, pos: [35, 35], radius: 11, points: 100 },
        { number: 3, pos: [35, -20], radius: 11, points: 100 },
        { number: 4, pos: [-35, -20], radius: 11, points: 100 },
        { number: 5, pos: [-35, 35], radius: 11, points: 150 }
      ],
      endZone: { pos: [0, -40], radius: 12, size: [18, 18], points: 200, labelEn: 'END', labelVi: 'END', color: '#10B981' },
      cargoItems: [],
      dropZones: []
    },
    {
      id: 'fll-magnetic-rescue',
      titleEn: '2. FLL Electromagnet Cargo Rescue',
      titleVi: '2. FLL Nam Châm Từ Cứu Hộ Vật Phẩm',
      worldName: 'grid',
      recommendedRobot: 'spikePrimeWRO',
      sequential: true,
      timeLimitSec: 120,
      descEn: 'Depart from START (0, 0), pass Beacon #1, energize Electromagnet (outD) at Beacon #2, pass Beacon #3, drop cargo in BASE (40, 0), and reach END (40, -30).',
      descVi: 'Xuất phát từ START (0, 0), qua Cột #1, bật Nam châm (outD) hút Lõi Từ Tính tại Cột #2 (0, 45), qua Cột #3 (25, 20), thả vật vào VÙNG THẢ (40, 0) và về đích END (40, -30).',
      startZone: { pos: [0, 0], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' },
      checkpoints: [
        { number: 1, pos: [0, 22], radius: 11, points: 100 },
        { number: 2, pos: [0, 45], radius: 11, points: 150 },
        { number: 3, pos: [25, 20], radius: 11, points: 150 }
      ],
      endZone: { pos: [40, -30], radius: 12, size: [18, 18], points: 150, labelEn: 'END', labelVi: 'END', color: '#10B981' },
      cargoItems: [
        { id: 'mag-core-1', labelEn: 'Magnetic Core', labelVi: 'Lõi Từ Tính', type: 'magnetic', pos: [0, 46], size: [4.2, 4.2, 4.2], color: '#F59E0B', points: 250 }
      ],
      dropZones: [
        { id: 'drop-base-1', labelEn: 'DROP ZONE', labelVi: 'VÙNG THẢ', pos: [40, 0], size: [20, 20], color: '#F59E0B' }
      ]
    },
    {
      id: 'spike-claw-logistics',
      titleEn: '3. Spike Prime Claw & Ultrasonic Transport',
      titleVi: '3. Spike Prime Tay Gắp & Cảm Biến Siêu Âm',
      worldName: 'grid',
      recommendedRobot: 'spikePrimeWRO',
      sequential: true,
      timeLimitSec: 120,
      descEn: 'Depart from START (0, 0), grasp cargo at Beacon #2 using Claw (outC), pass Beacon #3, release cargo at DROP ZONE (-40, 0), and finish at END (-40, -30).',
      descVi: 'Xuất phát từ START (0, 0), đóng Tay Gắp (outC) kẹp kiện hàng tại Cột #2 (0, 38), qua Cột #3 (-22, 18), đặt hàng vào VÙNG THẢ (-40, 0) và về đích END (-40, -30).',
      startZone: { pos: [0, 0], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' },
      checkpoints: [
        { number: 1, pos: [0, 20], radius: 11, points: 100 },
        { number: 2, pos: [0, 38], radius: 11, points: 150 },
        { number: 3, pos: [-22, 18], radius: 11, points: 150 }
      ],
      endZone: { pos: [-40, -30], radius: 12, size: [18, 18], points: 150, labelEn: 'END', labelVi: 'END', color: '#10B981' },
      cargoItems: [
        { id: 'claw-box-1', labelEn: 'WRO Cargo', labelVi: 'Kiện Hàng', type: 'graspable', pos: [0, 39], size: [3.8, 4.5, 3.8], color: '#EC4899', points: 300 }
      ],
      dropZones: [
        { id: 'drop-base-2', labelEn: 'DROP ZONE', labelVi: 'VÙNG THẢ', pos: [-40, 0], size: [20, 20], color: '#3B82F6' }
      ]
    },
    {
      id: 'wro-pid-line-master',
      titleEn: '4. WRO High-Speed PID Line Following',
      titleVi: '4. WRO Đua Bám Line PID Tốc Độ Cao',
      worldName: 'lineFollowing',
      recommendedRobot: 'spikePrimeWRO',
      sequential: true,
      timeLimitSec: 90,
      descEn: 'Depart from START (0, -80), use a PID controller with Color Sensor reflectance to pass Beacons #1 → #5 and reach END (-60, -20).',
      descVi: 'Xuất phát từ START (0, -80), dùng bộ điều khiển PID bám line vượt qua 5 Cột Sáng (#1 → #5) và cán đích END (-60, -20).',
      startZone: { pos: [0, -80], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' },
      checkpoints: [
        { number: 1, pos: [0, -45], radius: 14, points: 100 },
        { number: 2, pos: [0, 10], radius: 14, points: 100 },
        { number: 3, pos: [0, 65], radius: 14, points: 120 },
        { number: 4, pos: [-30, 82], radius: 15, points: 140 },
        { number: 5, pos: [-60, 40], radius: 15, points: 160 }
      ],
      endZone: { pos: [-60, -20], radius: 15, size: [18, 18], points: 200, labelEn: 'END', labelVi: 'END', color: '#10B981' },
      cargoItems: [],
      dropZones: []
    },
    {
      id: 'team-relay-marathon',
      titleEn: '5. Multiplayer Team Relay & Duel',
      titleVi: '5. Đua Tiếp Sức Đồng Đội (Relay / Duel)',
      worldName: 'grid',
      recommendedRobot: 'spikePrimeRelay',
      sequential: true,
      timeLimitSec: 150,
      descEn: 'Depart from START (0, 0), clear Beacons #1 → #2 (Stage 1) and Beacons #3 → #4 (Stage 2), and finish at END (35, -32).',
      descVi: 'Xuất phát từ START (0, 0), vượt Cột #1 → #2 (Chặng 1) và Cột #3 → #4 (Chặng 2), sau đó về đích tại END (35, -32).',
      startZone: { pos: [0, 0], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' },
      checkpoints: [
        { number: 1, pos: [-25, 25], radius: 12, points: 150, stage: 0 },
        { number: 2, pos: [0, 45], radius: 12, points: 200, stage: 0, handoffAfter: true },
        { number: 3, pos: [35, 25], radius: 12, points: 200, stage: 1 },
        { number: 4, pos: [35, -10], radius: 12, points: 250, stage: 1 }
      ],
      endZone: { pos: [35, -32], radius: 12, size: [20, 20], points: 200, labelEn: 'END', labelVi: 'END', color: '#10B981' },
      cargoItems: [
        { id: 'relay-baton', labelEn: 'Relay Baton', labelVi: 'Tín Vật', type: 'magnetic', pos: [0, 45], size: [4, 4, 4], color: '#06B6D4', points: 200 }
      ],
      dropZones: []
    }
  ];

  // Starter Python Competition Templates (PID, Beacons, Claw, Magnet)
  this.codeTemplates = {
    'pid-line': {
      titleEn: 'PID Line Following (WRO / FLL)',
      titleVi: 'Thuật toán PID Bám Line (WRO / FLL)',
      code: `#!/usr/bin/env python3
from ev3dev2.motor import MoveTank, OUTPUT_A, OUTPUT_B
from ev3dev2.sensor import INPUT_1
from ev3dev2.sensor.lego import ColorSensor
import time

tank = MoveTank(OUTPUT_A, OUTPUT_B)
cs_left = ColorSensor(INPUT_1)

KP = 1.15
KI = 0.01
KD = 0.45
BASE_SPEED = 42
TARGET_REFLECT = 50

integral = 0.0
last_error = 0.0

print("PID Line Following started from START...")
while True:
    actual = cs_left.reflected_light_intensity
    error = TARGET_REFLECT - actual
    integral = max(-100, min(100, integral + error))
    derivative = error - last_error
    last_error = error

    turn = KP * error + KI * integral + KD * derivative
    left_spd = max(-100, min(100, BASE_SPEED + turn))
    right_spd = max(-100, min(100, BASE_SPEED - turn))

    tank.on(left_spd, right_spd)
    time.sleep(0.02)
`
    },
    'beacon-nav': {
      titleEn: 'Beacon Waypoint Navigation (START → 1..5 → END)',
      titleVi: 'Điều hướng Lộ trình (START → 1..5 → END)',
      code: `#!/usr/bin/env python3
from ev3dev2.motor import MoveTank, OUTPUT_A, OUTPUT_B
from ev3dev2.sensor import INPUT_4, INPUT_5
from ev3dev2.sensor.lego import GyroSensor
from ev3dev2.sensor.virtual import GPSSensor
import math, time

tank = MoveTank(OUTPUT_A, OUTPUT_B)
gyro = GyroSensor(INPUT_4)
gps = GPSSensor(INPUT_5)

# Route from START (0, 0) -> Beacons #1..#5 -> END (0, -40)
waypoints = [
    ("#1", 0, 35),
    ("#2", 35, 35),
    ("#3", 35, -20),
    ("#4", -35, -20),
    ("#5", -35, 35),
    ("END", 0, -40)
]

def drive_to_point(label, tx, ty):
    print("Navigating to " + label + " at (" + str(tx) + ", " + str(ty) + ")...")
    while True:
        dx = tx - gps.x
        dy = ty - gps.y
        dist = math.sqrt(dx * dx + dy * dy)
        if dist < 6.5:
            tank.off()
            break

        target_angle = math.degrees(math.atan2(dx, dy))
        heading = gyro.angle % 360
        error = (target_angle - heading + 540) % 360 - 180

        turn = max(-45, min(45, error * 0.95))
        base = 48 if abs(error) < 25 else 15
        tank.on(base + turn, base - turn)
        time.sleep(0.02)

print("Departing from START (0, 0)...")
for label, px, py in waypoints:
    drive_to_point(label, px, py)
    print("Reached " + label + "!")
    time.sleep(0.15)

tank.off()
print("Route START -> #1..#5 -> END completed!")
`
    },
    'magnet-rescue': {
      titleEn: 'Electromagnet Rescue (START → 1..3 → END)',
      titleVi: 'Cứu hộ Vật phẩm bằng Nam Châm (START → END)',
      code: `#!/usr/bin/env python3
from ev3dev2.motor import MoveTank, Motor, OUTPUT_A, OUTPUT_B, OUTPUT_D
from ev3dev2.sensor import INPUT_4, INPUT_5
from ev3dev2.sensor.lego import GyroSensor
from ev3dev2.sensor.virtual import GPSSensor
import math, time

tank = MoveTank(OUTPUT_A, OUTPUT_B)
magnet = Motor(OUTPUT_D)
gyro = GyroSensor(INPUT_4)
gps = GPSSensor(INPUT_5)

def nav_to(tx, ty, stop_dist=5.5):
    while True:
        dx = tx - gps.x
        dy = ty - gps.y
        dist = math.sqrt(dx * dx + dy * dy)
        if dist < stop_dist:
            tank.off()
            return
        target_deg = math.degrees(math.atan2(dx, dy))
        err = (target_deg - (gyro.angle % 360) + 540) % 360 - 180
        turn = max(-40, min(40, err * 0.9))
        spd = 40 if abs(err) < 25 else 12
        tank.on(spd + turn, spd - turn)
        time.sleep(0.02)

print("1. Departing START (0, 0) -> Passing Beacon #1...")
nav_to(0, 22)

print("2. Energizing Electromagnet (outD) & picking up core at Beacon #2...")
magnet.on(100)
nav_to(0, 42, stop_dist=4.5)
time.sleep(0.4)

print("3. Passing Beacon #3 (25, 20)...")
nav_to(25, 20)

print("4. Delivering to DROP ZONE (40, 0) & releasing...")
nav_to(40, 0, stop_dist=6.0)
magnet.off()
tank.on_for_seconds(-30, -30, 0.5)

print("5. Proceeding to END (40, -30)...")
nav_to(40, -30, stop_dist=6.5)
print("Mission accomplished at END!")
`
    },
    'claw-logistics': {
      titleEn: 'Claw Gripper Transport (START → 1..3 → END)',
      titleVi: 'Vận chuyển bằng Tay Gắp (START → END)',
      code: `#!/usr/bin/env python3
from ev3dev2.motor import MoveTank, Motor, OUTPUT_A, OUTPUT_B, OUTPUT_C
from ev3dev2.sensor import INPUT_3, INPUT_4, INPUT_5
from ev3dev2.sensor.lego import UltrasonicSensor, GyroSensor
from ev3dev2.sensor.virtual import GPSSensor
import math, time

tank = MoveTank(OUTPUT_A, OUTPUT_B)
claw = Motor(OUTPUT_C)
ultra = UltrasonicSensor(INPUT_3)
gyro = GyroSensor(INPUT_4)
gps = GPSSensor(INPUT_5)

def nav_to(tx, ty, stop_dist=5.5):
    while True:
        dx = tx - gps.x
        dy = ty - gps.y
        if math.sqrt(dx * dx + dy * dy) < stop_dist:
            tank.off()
            return
        target_deg = math.degrees(math.atan2(dx, dy))
        err = (target_deg - (gyro.angle % 360) + 540) % 360 - 180
        turn = max(-40, min(40, err * 0.9))
        spd = 38 if abs(err) < 25 else 10
        tank.on(spd + turn, spd - turn)
        time.sleep(0.02)

print("Opening Claw Gripper (outC) at START (0, 0)...")
claw.on_for_degrees(50, -60)

print("Passing Beacon #1 & approaching cargo at Beacon #2...")
nav_to(0, 20)
nav_to(0, 35, stop_dist=4.5)
print("Ultrasonic distance:", round(ultra.distance_centimeters, 1), "cm -> Closing Claw!")

claw.on_for_degrees(60, 75)
time.sleep(0.3)

print("Passing Beacon #3 (-22, 18) & delivering to DROP ZONE (-40, 0)...")
nav_to(-22, 18)
nav_to(-40, 0, stop_dist=6.0)

print("Opening Claw Gripper to release cargo!")
claw.on_for_degrees(60, -75)
tank.on_for_seconds(-30, -30, 0.5)

print("Proceeding to END (-40, -30)...")
nav_to(-40, -30, stop_dist=6.5)
print("Claw transport completed at END!")
`
    }
  };

  // Runtime state
  this.activeChallenge = this.challenges[0];
  this.challengeEnabled = true;
  this.timerRunning = false;
  this.startTimeMs = 0;
  this.elapsedMs = 0;
  this.score = 0;
  this.clearedCheckpoints = new Set();
  this.deliveredCargoIds = new Set();
  this.endReached = false;
  this.checkpointMeshes = [];
  this.cargoMeshes = [];
  this.dropZoneMeshes = [];
  this.startZoneMeshObj = null;
  this.endZoneMeshObj = null;
  this.routeGuideLineMesh = null;

  // Trail & Ghost & Telemetry state
  this.trailEnabled = true;
  this.trailPoints = [];
  this.trailMesh = null;
  this.lastTrailSampleMs = 0;

  this.ghostEnabled = true;
  this.currentRecording = [];
  this.bestGhostFrames = {};
  this.ghostMesh = null;
  this.lastGhostSampleMs = 0;

  this.telemetryHistory = [];
  this.MAX_TELEMETRY_POINTS = 100;

  // WebSocket Multiplayer state
  this.ws = null;
  this.clientId = null;
  this.roomState = null;
  this.mySlot = 0;
  this.remoteRobotMeshes = {};
  this.lastPoseSentMs = 0;

  this.currentLayoutMode = 'split'; // 'split' | 'sim-only' | 'code-only'
  this.currentCodeMode = 'blocks';   // 'blocks' | 'python'

  this.init = function() {
    if (typeof main !== 'undefined' && typeof main.updateTextLanguage === 'function') {
      main.updateTextLanguage();
    }
    self.injectUnifiedNavigationAndSidePane();
    self.initSplitWorkspace();
    self.connectWebSocket();
    self.hookSimulatorLifecycle();

    try {
      var savedGhosts = localStorage.getItem('gearsBestGhosts');
      if (savedGhosts) {
        self.bestGhostFrames = JSON.parse(savedGhosts);
      }
    } catch (e) {}
  };

  this.toggleCodePanel = function(forceState) {
    var $code = $('#codePanel');
    var $splitter = $('#leftSplitter');
    var $btn = $('#btnToggleLeftCode');
    var $sep = $('.sim-toolbar-sep-code');
    var isCurrentlyCollapsed = $code.hasClass('collapsed');
    var shouldCollapse = (typeof forceState === 'boolean') ? !forceState : !isCurrentlyCollapsed;

    if (shouldCollapse) {
      $code.addClass('collapsed');
      $splitter.addClass('collapsed');
      $btn.css('display', 'inline-flex');
      $sep.css('display', 'inline-block');
      try { localStorage.setItem('gearsCodeCollapsed', 'true'); } catch (e) {}
    } else {
      $code.removeClass('collapsed');
      $splitter.removeClass('collapsed');
      $btn.hide();
      $sep.hide();
      try { localStorage.setItem('gearsCodeCollapsed', 'false'); } catch (e) {}
      if (self.currentCodeMode === 'blocks' && typeof blocklyPanel !== 'undefined') {
        blocklyPanel.onActive();
      } else if (typeof pythonPanel !== 'undefined') {
        pythonPanel.onActive();
      }
    }
    self.triggerAllResizes();
  };

  this.toggleSidePane = function(forceState) {
    var $pane = $('#gearsSidePane');
    var $splitter = $('#rightSplitter');
    var $btn = $('#gearsSidePaneToggle');
    var isCurrentlyCollapsed = $pane.hasClass('collapsed');
    var shouldCollapse = (typeof forceState === 'boolean') ? !forceState : !isCurrentlyCollapsed;

    if (shouldCollapse) {
      $pane.addClass('collapsed');
      $splitter.addClass('collapsed');
      $btn.css('display', 'inline-flex');
      try { localStorage.setItem('gearsSideCollapsed', 'true'); } catch (e) {}
    } else {
      $pane.removeClass('collapsed');
      $splitter.removeClass('collapsed');
      $btn.hide();
      try { localStorage.setItem('gearsSideCollapsed', 'false'); } catch (e) {}
    }
    self.triggerAllResizes();
  };

  this.initSplitWorkspace = function() {
    // 1. Code Mode Tabs in Code Panel (Blocks vs Python)
    $('#tabBlocksBtn').on('click', function() { self.setCodeMode('blocks'); });
    $('#tabPythonBtn').on('click', function() { self.setCodeMode('python'); });

    // 2. Collapse / Expand Controls for Left Code Panel
    $('#btnToggleLeftCode').on('click', function() { self.toggleCodePanel(); });
    $('#btnCollapseCode').on('click', function() { self.toggleCodePanel(false); });

    // 3. Save buttons in Code Header
    $('.gb-code-save-btn.saveBlockly').on('click', function() {
      if (typeof blockly !== 'undefined' && typeof blockly.saveLocalStorage === 'function') {
        blockly.saveLocalStorage();
        if (typeof toastMsg === 'function') toastMsg(self.t('Blocks project saved!', 'Đã lưu khối lệnh!'));
      }
    });
    $('.gb-code-save-btn.savePython').on('click', function() {
      if (typeof filesManager !== 'undefined' && typeof filesManager.saveLocalStorage === 'function') {
        filesManager.saveLocalStorage();
        if (typeof toastMsg === 'function') toastMsg(self.t('Python project saved!', 'Đã lưu mã Python!'));
      }
    });

    // 4. Dual Draggable Splitters (Left: Code Panel, Right: Inspection Panel)
    var isDraggingLeft = false;
    var isDraggingRight = false;
    var $leftSplitter = $('#leftSplitter');
    var $rightSplitter = $('#rightSplitter');
    var $codePanel = $('#codePanel');
    var $sidePane = $('#gearsSidePane');

    $leftSplitter.on('mousedown touchstart', function(e) {
      isDraggingLeft = true;
      $leftSplitter.addClass('dragging');
      $('body').addClass('is-resizing').css('user-select', 'none');
      e.preventDefault();
    });

    $rightSplitter.on('mousedown touchstart', function(e) {
      isDraggingRight = true;
      $rightSplitter.addClass('dragging');
      $('body').addClass('is-resizing').css('user-select', 'none');
      e.preventDefault();
    });

    $(window).on('mousemove touchmove', function(e) {
      if (!isDraggingLeft && !isDraggingRight) return;
      var clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      if (!clientX) return;
      var totalW = window.innerWidth;

      if (isDraggingLeft) {
        // Dragging Left Splitter: new width of Left Code Panel is clientX
        var maxCodeW = Math.max(300, totalW - 400);
        var newCodeW = Math.max(260, Math.min(maxCodeW, clientX));
        $codePanel.css({ width: newCodeW + 'px', flex: '0 0 ' + newCodeW + 'px' });
        try { localStorage.setItem('gearsCodeWidth', newCodeW); } catch (err) {}
      } else if (isDraggingRight) {
        // Dragging Right Splitter: new width of Right Inspection Panel is totalW - clientX
        var maxSideW = Math.max(260, totalW - 400);
        var newSideW = Math.max(250, Math.min(maxSideW, totalW - clientX));
        $sidePane.css({ width: newSideW + 'px', flex: '0 0 ' + newSideW + 'px' });
        try { localStorage.setItem('gearsSidePaneWidth', newSideW); } catch (err) {}
      }
    });

    $(window).on('mouseup touchend', function() {
      if (isDraggingLeft || isDraggingRight) {
        isDraggingLeft = false;
        isDraggingRight = false;
        $leftSplitter.removeClass('dragging');
        $rightSplitter.removeClass('dragging');
        $('body').removeClass('is-resizing').css('user-select', '');
        self.triggerAllResizes();
      }
    });

    // 5. Restore saved widths and collapsed states
    try {
      var savedCodeW = localStorage.getItem('gearsCodeWidth');
      if (savedCodeW) {
        var cw = parseInt(savedCodeW, 10);
        if (cw >= 260 && cw <= window.innerWidth - 350) {
          $codePanel.css({ width: cw + 'px', flex: '0 0 ' + cw + 'px' });
        }
      }
      var savedSideW = localStorage.getItem('gearsSidePaneWidth');
      if (savedSideW) {
        var sw = parseInt(savedSideW, 10);
        if (sw >= 240 && sw <= window.innerWidth - 350) {
          $sidePane.css({ width: sw + 'px', flex: '0 0 ' + sw + 'px' });
        }
      }
      if (localStorage.getItem('gearsCodeCollapsed') === 'true') {
        self.toggleCodePanel(false);
      } else {
        $('#btnToggleLeftCode').hide();
        $('.sim-toolbar-sep-code').hide();
      }
      if (localStorage.getItem('gearsSideCollapsed') === 'true') {
        self.toggleSidePane(false);
      } else {
        $('#gearsSidePaneToggle').hide();
      }
    } catch (e) {}

    // 7. Hook main.tabClicked for backward compatibility
    if (typeof main !== 'undefined' && typeof main.tabClicked === 'function') {
      var origTabClicked = main.tabClicked;
      main.tabClicked = function(tabNav) {
        var match = (typeof tabNav === 'string') ? tabNav : $(this).attr('id');
        if (match === 'navBlocks') {
          self.setCodeMode('blocks');
          self.toggleCodePanel(true);
          return;
        } else if (match === 'navPython') {
          self.setCodeMode('python');
          self.toggleCodePanel(true);
          return;
        } else if (match === 'navSim') {
          if (typeof simPanel !== 'undefined' && typeof simPanel.onActive === 'function') {
            simPanel.onActive();
          }
          self.triggerAllResizes();
          return;
        }
        origTabClicked.call(this, tabNav);
      };
    }

    // 8. Screenshot button in Sim Toolbar
    $('#btnTakeScreenshot').on('click', function() {
      if (typeof babylon !== 'undefined' && babylon.engine && babylon.cameraArc) {
        BABYLON.Tools.CreateScreenshot(babylon.engine, babylon.cameraArc, { precision: 1.5 });
        if (typeof toastMsg === 'function') {
          toastMsg(self.t('3D Screenshot saved!', 'Đã chụp và lưu ảnh 3D!'));
        }
      }
    });

    self.setCodeMode('blocks');
    if (typeof simPanel !== 'undefined' && typeof simPanel.onActive === 'function') {
      simPanel.onActive();
    }
    self.triggerAllResizes();
  };

  this.setLayoutMode = function(mode) {
    if (mode === 'sim-only') {
      self.toggleCodePanel(false);
    } else if (mode === 'code-only') {
      self.toggleCodePanel(true);
    } else {
      self.toggleCodePanel(true);
    }
  };

  this.setCodeMode = function(mode) {
    self.currentCodeMode = mode;
    if (mode === 'python') {
      $('#tabPythonBtn').addClass('active');
      $('#tabBlocksBtn').removeClass('active');
      $('#pythonSubpanel').addClass('active');
      $('#blocklySubpanel').removeClass('active');
      $('.savePython').removeClass('hide');
      $('.saveBlockly').addClass('hide');
      if (typeof pythonPanel !== 'undefined') {
        pythonPanel.onActive();
      }
    } else {
      // 'blocks'
      $('#tabBlocksBtn').addClass('active');
      $('#tabPythonBtn').removeClass('active');
      $('#blocklySubpanel').addClass('active');
      $('#pythonSubpanel').removeClass('active');
      $('.saveBlockly').removeClass('hide');
      $('.savePython').addClass('hide');
      if (typeof blocklyPanel !== 'undefined') {
        blocklyPanel.onActive();
      }
    }
    self.triggerAllResizes();
  };

  this.triggerAllResizes = function() {
    setTimeout(function() {
      if (babylon && babylon.engine) babylon.engine.resize();
      if (typeof Blockly !== 'undefined' && typeof blockly !== 'undefined' && blockly.workspace) {
        Blockly.svgResize(blockly.workspace);
      }
      if (typeof pythonPanel !== 'undefined' && pythonPanel.editor) {
        pythonPanel.editor.resize();
      }
      window.dispatchEvent(new Event('resize'));
    }, 60);
  };

  this.getChallengeTitle = function(ch) {
    if (!ch) return '';
    return self.isVi() ? ch.titleVi : ch.titleEn;
  };

  this.getChallengeDesc = function(ch) {
    if (!ch) return '';
    return self.isVi() ? ch.descVi : ch.descEn;
  };

  this.injectUnifiedNavigationAndSidePane = function() {
    // 1. Add a single native-styled menu item "Competition" / "Thi đấu" in nav .menuBar
    var $menuBar = $('nav .menuBar');
    if ($menuBar.length) {
      var $compMenu = $('<div class="menuItem competitionMenu">' + i18n.get('#main-competition#') + '</div>');
      var $helpMenu = $menuBar.find('.helpMenu');
      if ($helpMenu.length) {
        $compMenu.insertBefore($helpMenu);
      } else {
        $menuBar.append($compMenu);
      }
      self.$compMenu = $compMenu;
      $compMenu.on('click', function(e) {
        self.toggleCompetitionDropdown(e);
      });
    }

    // Show active language code on top-right globe button for clarity
    var $langBtn = $('header .language');
    if ($langBtn.length) {
      var code = (typeof LANG !== 'undefined' ? LANG : 'en').toUpperCase();
      $langBtn.html('<span class="icon-globe"></span> ' + code + ' &#x25BE;');
    }

    // 2. Populate Unified Simulator Toolbar & Docked Side Pane inside #simPanel
    var $simPanel = $('#simPanel');
    if (!$simPanel.length) return;

    var challengeOptionsHtml =
      '<option value="none">' + self.t('Free Sandbox (No Beacons)', 'Chế độ Tự do (Không cột mốc)') + '</option>' +
      self.challenges.map(function(c) {
        var sel = self.activeChallenge && self.activeChallenge.id === c.id ? 'selected' : '';
        return '<option value="' + c.id + '" ' + sel + '>' + self.getChallengeTitle(c) + '</option>';
      }).join('');

    var codeOptionsHtml = Object.keys(self.codeTemplates).map(function(k) {
      var tpl = self.codeTemplates[k];
      return '<option value="' + k + '">' + (self.isVi() ? tpl.titleVi : tpl.titleEn) + '</option>';
    }).join('');

    var robotOptionsHtml = robotTemplates.map(function(r) {
      var sel = robot && robot.options && robot.options.name === r.name ? 'selected' : '';
      var label = i18n.get(r.shortDescription);
      return '<option value="' + r.name + '" ' + sel + '>' + label + '</option>';
    }).join('');

    var curOpts = (robot && robot.options) || {};
    var hasClaw = (curOpts.components || []).some(function(c) { return c.type === 'ClawActuator'; });
    var hasMagnet = (curOpts.components || []).some(function(c) { return c.type === 'MagnetActuator'; });
    var hasArm = (curOpts.components || []).some(function(c) { return c.type === 'ArmActuator'; });
    var curTier = (babylon && babylon.perfConfig && babylon.perfConfig.tier) || 'low';

    // Center Toolbar: Mission Timer, Score & Beacons
    $('#gearsMissionTopBar').html(`
      <span class="top-timer" id="wroTimerDisplay">00:00.00</span>
      <span class="top-score"><span id="wroScoreDisplay">0</span> pts</span>
      <span class="top-beacons" id="wroTopBeacons"></span>
    `);

    // Right Toolbar: Performance Switcher & Side Pane Expand Button (only shown when Side Pane is collapsed)
    $('#simToolbarRight').html(`
      <button type="button" class="sim-tool-btn sim-action-btn" id="gbPerfQuickBadge" title="${self.t('Click to switch graphics performance mode', 'Nhấn để đổi chế độ đồ họa')}"></button>
      <button type="button" class="sim-tool-btn sim-action-btn" id="gearsSidePaneToggle" style="display:none;" title="${self.t('Open Inspection Panel', 'Mở bảng điều khiển')}">
        <svg class="side-toggle-arrow" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="10 3 5 8 10 13"/></svg>
        <span class="btn-text">${self.t('Panel', 'Bảng')}</span>
      </button>
    `);

    // Right Docked Side Pane (#gearsSidePane)
    var sidePaneHtml = `
      <div class="gb-pane-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>${self.t('WRO / FLL Control Center', 'Bảng Điều Khiển WRO / FLL')}</span>
          <span id="wroRoomBadge" style="font-size:85%; background:rgba(255,255,255,0.22); padding:1px 6px; border-radius:3px;">Solo</span>
        </div>
        <button type="button" class="gb-pane-close-btn" id="btnCloseSidePane" title="${self.t('Collapse Panel', 'Thu gọn bảng')}">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 3 11 8 6 13"/></svg>
        </button>
      </div>

      <ul class="gb-pane-tabs">
        <li class="active" data-tab="mission">${self.t('Mission', 'Nhiệm vụ')}</li>
        <li data-tab="telemetry">${self.t('Sensors', 'Cảm biến')}</li>
        <li data-tab="robot">${self.t('Robot', 'Robot')}</li>
        <li data-tab="multiplayer">${self.t('Team', 'Đấu đội')}</li>
      </ul>

      <div class="gb-pane-body">
        <!-- TAB 1: MISSION & CHALLENGE -->
        <div class="gb-tab-section active" data-section="mission">
          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Challenge Map', 'Bài thi Sa bàn')}</span>
            </div>
            <select id="wroSelectChallenge" class="gb-select">${challengeOptionsHtml}</select>
            <p class="gb-desc" id="wroChallengeDescText">${self.getChallengeDesc(self.activeChallenge)}</p>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Progress & Beacons', 'Tiến độ & Cột sáng')}</span>
            </div>
            <table class="gb-data-table">
              <tr>
                <td>${self.t('Elapsed Time', 'Thời gian')}</td>
                <td class="val" id="wroSideTimer">00:00.000</td>
              </tr>
              <tr>
                <td>${self.t('Total Score', 'Điểm số')}</td>
                <td class="val" id="wroSideScore">0</td>
              </tr>
            </table>
            <div id="wroBeaconsStrip" style="display:flex; gap:4px; flex-wrap:wrap; margin-top:2px;"></div>
            <div class="gb-desc" id="wroMissionStatus">${self.t('Ready — Click Play to start', 'Sẵn sàng — Nhấn Play để chạy')}</div>
            <div class="gb-btn-row">
              <button type="button" class="gb-btn primary" id="wroBtnStartTimer">${self.t('Run / Stop', 'Chạy / Dừng')}</button>
              <button type="button" class="gb-btn" id="wroBtnResetChallenge">${self.t('Reset', 'Đặt lại')}</button>
              <button type="button" class="gb-btn" id="wroBtnLeaderboard">${self.t('Ranks', 'BXH')}</button>
            </div>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Starter Python Algorithms', 'Thuật toán Python mẫu')}</span>
            </div>
            <select id="wroSelectCodeTpl" class="gb-select">${codeOptionsHtml}</select>
            <div class="gb-btn-row">
              <button type="button" class="gb-btn primary" id="wroBtnApplyCodeTpl">${self.t('Load into Python Editor', 'Nạp vào trình sửa Python')}</button>
            </div>
          </div>
        </div>

        <!-- TAB 2: SENSORS, PORT READINGS, ODOMETRY & PID GRAPH -->
        <div class="gb-tab-section" data-section="telemetry">
          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Live Odometry & Actuators', 'Thông số Cảm biến & Cơ cấu')}</span>
              <span id="wroFpsReadout" style="font-size:85%; color:#64748B;">60 FPS</span>
            </div>
            <table class="gb-data-table">
              <tr>
                <td>${self.t('Position (X, Y)', 'Tọa độ (X, Y)')}</td>
                <td class="val" id="wroOdomXZ">0.0, 0.0</td>
              </tr>
              <tr>
                <td>${self.t('Heading (Gyro)', 'Góc hướng (Gyro)')}</td>
                <td class="val" id="wroOdomHeading">0.0°</td>
              </tr>
              <tr>
                <td>${self.t('Color Reflect (L/R)', 'Phản xạ màu (T/P)')}</td>
                <td class="val" id="wroOdomColor">100% / 100%</td>
              </tr>
              <tr>
                <td>${self.t('Claw (outC) / Magnet (outD)', 'Tay gắp / Nam châm')}</td>
                <td class="val" id="wroOdomActuator">Open / Off</td>
              </tr>
            </table>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('PID Error & Color Graph', 'Đồ thị Sai số PID & Cảm biến')}</span>
            </div>
            <canvas id="wroPidCanvas" width="255" height="80"></canvas>
            <div class="gb-row" style="font-size:11px; color:#475569; min-height:22px;">
              <span style="color:#0284c7; font-weight:700;">■ ${self.t('Reflectance', 'Phản xạ')}</span>
              <span style="color:#d97706; font-weight:700;">■ ${self.t('PID Error', 'Sai số PID')}</span>
            </div>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Port Readings (in1..N / outA..D)', 'Chi tiết Cổng Cảm biến & Động cơ')}</span>
            </div>
            <div id="wroNativeSensorsMount"></div>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('3D Visual Helpers', 'Hiển thị Hỗ trợ 3D')}</span>
            </div>
            <label class="gb-row" style="cursor:pointer;">
              <span>${self.t('3D Robot Path Trail', 'Vệt đường đi 3D của Robot')}</span>
              <input type="checkbox" id="wroToggleTrail" ${self.trailEnabled ? 'checked' : ''}>
            </label>
            <label class="gb-row" style="cursor:pointer;">
              <span>${self.t('Best Run Ghost Replay', 'Robot Bóng ma kỷ lục')}</span>
              <input type="checkbox" id="wroToggleGhost" ${self.ghostEnabled ? 'checked' : ''}>
            </label>
          </div>
        </div>

        <!-- TAB 3: ROBOT SETUP, SPIKE PRIME / EV3 & GLB IMPORT -->
        <div class="gb-tab-section" data-section="robot">
          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Robot Template (Spike / EV3)', 'Khung Robot (Spike / EV3)')}</span>
            </div>
            <select id="wroSelectRobotPreset" class="gb-select">${robotOptionsHtml}</select>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Actuators & Physics', 'Cơ cấu & Vật lý thực tế')}</span>
            </div>
            <label class="gb-row" style="cursor:pointer;">
              <span>${self.t('Claw Gripper (outC)', 'Tay gắp song song (outC)')}</span>
              <input type="checkbox" id="wroChkClaw" ${hasClaw ? 'checked' : ''}>
            </label>
            <label class="gb-row" style="cursor:pointer;">
              <span>${self.t('Electromagnet (outD)', 'Nam châm điện từ (outD)')}</span>
              <input type="checkbox" id="wroChkMagnet" ${hasMagnet ? 'checked' : ''}>
            </label>
            <label class="gb-row" style="cursor:pointer;">
              <span>${self.t('Motorized Arm', 'Cánh tay nâng hạ')}</span>
              <input type="checkbox" id="wroChkArm" ${hasArm ? 'checked' : ''}>
            </label>
            <div class="gb-row">
              <span>${self.t('Wheel Dia (cm):', 'Đường kính bánh:')}</span>
              <input type="number" id="wroPhysWheelDia" class="gb-input" style="width:90px;" step="0.2" value="${curOpts.wheelDiameter || 5.6}">
            </div>
            <div class="gb-row">
              <span>${self.t('Chassis Mass (g):', 'Khối lượng (g):')}</span>
              <input type="number" id="wroPhysBodyMass" class="gb-input" style="width:90px;" step="50" value="${curOpts.bodyMass || 1150}">
            </div>
            <div class="gb-row">
              <span>${self.t('Tire Friction:', 'Độ bám lốp:')}</span>
              <input type="number" id="wroPhysFriction" class="gb-input" style="width:90px;" step="1" value="${curOpts.wheelFriction || 12}">
            </div>
            <div class="gb-row">
              <span>${self.t('Performance:', 'Đồ họa:')}</span>
              <select id="wroPerfSelect" class="gb-select" style="width:135px;">
                <option value="low" ${curTier === 'low' ? 'selected' : ''}>${self.t('Low-Spec (Fast)', 'Siêu nhẹ (Máy yếu)')}</option>
                <option value="balanced" ${curTier === 'balanced' ? 'selected' : ''}>${self.t('Balanced', 'Cân bằng')}</option>
                <option value="high" ${curTier === 'high' ? 'selected' : ''}>${self.t('High (Shadows)', 'Cao (Đổ bóng)')}</option>
              </select>
            </div>
            <div class="gb-btn-row">
              <button type="button" class="gb-btn primary" id="wroBtnApplyRobotConfig">${self.t('Apply & Rebuild Robot', 'Áp dụng & Tạo lại Robot')}</button>
            </div>
          </div>

          <div class="gb-box">
            <div class="gb-box-title">
              <span>${self.t('Import 3D Model (.GLB/.GLTF)', 'Nhập Mô hình 3D (.GLB/.GLTF)')}</span>
            </div>
            <input type="file" id="wroGlbFileInput" accept=".glb,.gltf" class="gb-input">
            <div class="gb-row">
              <span style="flex-shrink:0;">${self.t('Model Scale:', 'Tỉ lệ (Scale):')}</span>
              <input type="number" id="wroGlbScale" class="gb-input" style="width:72px; flex-shrink:0;" value="1.0" step="0.1" min="0.05" max="20">
              <button type="button" class="gb-btn" id="wroBtnOpenConfigurator">${self.t('3D Builder', 'Thiết kế 3D')}</button>
            </div>
          </div>
        </div>

        <!-- TAB 4: REALTIME MULTIPLAYER (DUEL & RELAY) -->
        <div class="gb-tab-section" data-section="multiplayer">
          <div id="wroMultiplayerPaneContent"></div>
        </div>
      </div>
    `;

    $('#gearsSidePane').html(sidePaneHtml);

    // Mount native .sensorReadings inside #wroNativeSensorsMount so all sensor tables are unified
    var $nativeSensors = $simPanel.find('.sensorReadings');
    if ($nativeSensors.length) {
      $('#wroNativeSensorsMount').append($nativeSensors);
      $nativeSensors.removeClass('hide');
    }

    // Clicking the toolbar .sensors icon opens the Sensors tab in the Side Pane
    $simPanel.find('.sensors').off('click').on('click', function() {
      if (typeof simPanel !== 'undefined' && simPanel.sensors.length === 0) {
        simPanel.initSensorsPanel();
      }
      if ($nativeSensors.length) {
        $nativeSensors.removeClass('hide');
      }
      self.activateSidePaneTab('telemetry');
    });

    self.updatePerfButtonLabel();
    self.renderHudCheckpoints();
    self.renderMultiplayerRoomBody($('#wroMultiplayerPaneContent'));

    // Side Pane Collapse / Expand Toggle
    $('#gearsSidePaneToggle').off('click').on('click', function() {
      self.toggleSidePane();
    });
    $(document).off('click', '#btnCloseSidePane').on('click', '#btnCloseSidePane', function() {
      self.toggleSidePane(false);
    });

    // Quick Perf Badge Click
    $('#gbPerfQuickBadge').on('click', function() {
      self.cyclePerformanceTier();
      $('#wroPerfSelect').val(babylon.perfConfig.tier);
    });

    // Side Pane Tab Switching
    $('.gb-pane-tabs li').on('click', function() {
      var tab = $(this).data('tab');
      self.activateSidePaneTab(tab);
    });

    // Mission Controls
    $('#wroSelectChallenge').on('change', function() {
      var val = $(this).val();
      if (val === 'none') {
        self.challengeEnabled = false;
        $('#gearsMissionTopBar').addClass('hide');
        self.spawnChallengeObjectsInScene();
      } else {
        $('#gearsMissionTopBar').removeClass('hide');
        self.selectChallengeById(val, false);
      }
    });

    $('#wroBtnStartTimer').on('click', function() {
      if (typeof simPanel !== 'undefined') {
        simPanel.runSim();
      }
    });

    $('#wroBtnResetChallenge').on('click', function() {
      if (typeof simPanel !== 'undefined') {
        simPanel.resetSim();
      }
    });

    $('#wroBtnLeaderboard').on('click', function() {
      self.openLeaderboardModal();
    });

    $('#wroBtnApplyCodeTpl').on('click', function() {
      var key = $('#wroSelectCodeTpl').val();
      self.applyPythonTemplate(key);
    });

    // Telemetry Toggles
    $('#wroToggleTrail').on('change', function() {
      self.trailEnabled = $(this).is(':checked');
      if (!self.trailEnabled && self.trailMesh) {
        self.trailMesh.dispose();
        self.trailMesh = null;
      }
    });

    $('#wroToggleGhost').on('change', function() {
      self.ghostEnabled = $(this).is(':checked');
      if (self.ghostMesh) {
        self.ghostMesh.setEnabled(self.ghostEnabled);
      }
    });

    // Robot Preset & Actuators & GLB Controls
    $('#wroSelectRobotPreset').on('change', function() {
      var botName = $(this).val();
      var tpl = robotTemplates.find(function(r) { return r.name === botName; });
      if (tpl) {
        robot.options = JSON.parse(JSON.stringify(tpl));
        var hasC = (robot.options.components || []).some(function(c) { return c.type === 'ClawActuator'; });
        var hasM = (robot.options.components || []).some(function(c) { return c.type === 'MagnetActuator'; });
        var hasA = (robot.options.components || []).some(function(c) { return c.type === 'ArmActuator'; });
        $('#wroChkClaw').prop('checked', hasC);
        $('#wroChkMagnet').prop('checked', hasM);
        $('#wroChkArm').prop('checked', hasA);
        $('#wroPhysWheelDia').val(robot.options.wheelDiameter || 5.6);
        $('#wroPhysBodyMass').val(robot.options.bodyMass || 1150);
        $('#wroPhysFriction').val(robot.options.wheelFriction || 12);
        babylon.resetScene().then(function() {
          if (typeof simPanel !== 'undefined') simPanel.initSensorsPanel();
        });
        if (typeof toastMsg === 'function') {
          toastMsg(self.t('Loaded robot: ', 'Đã nạp khung Robot: ') + i18n.get(tpl.shortDescription));
        }
      }
    });

    $('#wroBtnApplyRobotConfig').on('click', function() {
      self.applyRobotConfigFromPane();
    });

    $('#wroGlbFileInput').on('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var blobUrl = URL.createObjectURL(file);
      var scale = parseFloat($('#wroGlbScale').val()) || 1.0;
      robot.options.components = robot.options.components || [];
      robot.options.components.push({
        type: 'CustomModel',
        position: [0, 3.2, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: blobUrl,
          scale: scale,
          color: '4994FB'
        }
      });
      babylon.resetScene().then(function() {
        if (typeof simPanel !== 'undefined') simPanel.initSensorsPanel();
      });
      if (typeof toastMsg === 'function') {
        toastMsg(self.t('Attached 3D Model: ', 'Đã gắn mô hình 3D: ') + file.name);
      }
    });

    $('#wroBtnOpenConfigurator').on('click', function() {
      if (typeof main !== 'undefined' && typeof main.openPage === 'function') {
        main.openPage('configurator.html');
      }
    });
  };

  this.activateSidePaneTab = function(tabName) {
    var $pane = $('#gearsSidePane');
    if ($pane.hasClass('collapsed')) {
      self.toggleSidePane(true);
    }
    if (tabName === 'telemetry' && typeof simPanel !== 'undefined') {
      if (simPanel.sensors.length === 0) {
        simPanel.initSensorsPanel();
      }
      $('#wroNativeSensorsMount .sensorReadings').removeClass('hide');
    }
    $('.gb-pane-tabs li').removeClass('active');
    $('.gb-pane-tabs li[data-tab="' + tabName + '"]').addClass('active');
    $('.gb-tab-section').removeClass('active');
    $('.gb-tab-section[data-section="' + tabName + '"]').addClass('active');
  };

  // Native GearsBot Dropdown Menu for "Competition" / "Thi đấu" in top menuBar
  this.toggleCompetitionDropdown = function(e) {
    if ($('.competitionMenuDropDown').length === 0) {
      $('.menuDropDown').remove();
      e.stopPropagation();

      var tierLabel = (babylon && babylon.perfConfig && babylon.perfConfig.tier) || 'low';
      var menuItems = [
        {
          html: self.t('Mission & Challenge Panel', 'Bảng Nhiệm vụ & Cột sáng WRO/FLL'),
          line: false,
          callback: function() {
            $('#navSim').trigger('click');
            self.activateSidePaneTab('mission');
          }
        },
        {
          html: self.t('PID Graph & Sensor Telemetry', 'Đồ thị PID & Thông số Cảm biến'),
          line: false,
          callback: function() {
            $('#navSim').trigger('click');
            self.activateSidePaneTab('telemetry');
          }
        },
        {
          html: self.t('LEGO Spike Prime / EV3 & 3D Import', 'Cấu hình LEGO Spike / EV3 & 3D (.GLB)'),
          line: false,
          callback: function() {
            $('#navSim').trigger('click');
            self.activateSidePaneTab('robot');
          }
        },
        {
          html: self.t('Multiplayer Room (Team Relay / Duel)', 'Phòng Thi đấu Đội (Tiếp sức / Duel)'),
          line: true,
          callback: function() {
            $('#navSim').trigger('click');
            self.activateSidePaneTab('multiplayer');
          }
        },
        {
          html: self.t('Load Sample Python Algorithm', 'Nạp Code mẫu Python (PID / Gyro)'),
          line: false,
          callback: function() {
            self.loadRecommendedCodeForActiveChallenge();
            $('#navPython').trigger('click');
          }
        },
        {
          html: self.t('Competition Leaderboard', 'Bảng xếp hạng thời gian'),
          line: true,
          callback: function() {
            self.openLeaderboardModal();
          }
        },
        {
          html: self.t('Graphics Mode: ', 'Chế độ đồ họa: ') + tierLabel.toUpperCase(),
          line: false,
          callback: function() {
            self.cyclePerformanceTier();
          }
        }
      ];

      menuDropDown(self.$compMenu, menuItems, { className: 'competitionMenuDropDown' });
    }
  };

  this.applyRobotConfigFromPane = function() {
    robot.options.wheelDiameter = parseFloat($('#wroPhysWheelDia').val()) || 5.6;
    robot.options.bodyMass = parseFloat($('#wroPhysBodyMass').val()) || 1150;
    robot.options.wheelFriction = parseFloat($('#wroPhysFriction').val()) || 12;

    var comps = (robot.options.components || []).filter(function(c) {
      return c.type !== 'ClawActuator' && c.type !== 'MagnetActuator' && c.type !== 'ArmActuator';
    });

    if ($('#wroChkClaw').is(':checked')) {
      comps.push({
        type: 'ClawActuator',
        position: [0, -0.6, 8.2],
        rotation: [0, 0, 0],
        options: { jawLength: 6.8, jawSpread: 5.2, baseColor: '06B6D4', jawColor: 'F59E0B', gripRange: 6.5 }
      });
    }
    if ($('#wroChkMagnet').is(':checked')) {
      comps.push({
        type: 'MagnetActuator',
        position: [0, -0.5, 9.2],
        rotation: [0, 0, 0],
        options: { maxRange: 12, maxPower: 6500 }
      });
    }
    if ($('#wroChkArm').is(':checked')) {
      comps.push({
        type: 'ArmActuator',
        position: [0, 1.2, 5.5],
        rotation: [0, 0, 0],
        options: { armLength: 12, startAngle: 10, baseColor: '475569', armColor: 'F59E0B' }
      });
    }
    robot.options.components = comps;

    var chosenTier = $('#wroPerfSelect').val();
    if (chosenTier) {
      babylon.setPerformanceTier(chosenTier, true);
      self.updatePerfButtonLabel();
    }

    babylon.resetScene().then(function() {
      if (typeof simPanel !== 'undefined') {
        simPanel.initSensorsPanel();
      }
    });
    if (typeof toastMsg === 'function') {
      toastMsg(self.t('Robot configuration & physics updated!', 'Đã cập nhật cơ cấu Robot & thông số vật lý!'));
    }
  };

  this.updatePerfButtonLabel = function() {
    if (!babylon || !babylon.perfConfig) return;
    var mapEn = { low: 'Perf: Low', balanced: 'Perf: Mid', high: 'Perf: High' };
    var mapVi = { low: 'Đồ họa: Nhẹ', balanced: 'Đồ họa: Vừa', high: 'Đồ họa: Cao' };
    var txt = (self.isVi() ? mapVi : mapEn)[babylon.perfConfig.tier] || 'Low';
    $('#gbPerfQuickBadge').text(txt);
  };

  this.cyclePerformanceTier = function() {
    var order = ['low', 'balanced', 'high'];
    var current = (babylon && babylon.perfConfig && babylon.perfConfig.tier) || 'low';
    var next = order[(order.indexOf(current) + 1) % order.length];
    babylon.setPerformanceTier(next);
    self.updatePerfButtonLabel();
    if (typeof toastMsg === 'function') {
      toastMsg(self.t('Switched graphics mode: ', 'Đã đổi chế độ đồ họa: ') + next.toUpperCase());
    }
  };

  this.hookSimulatorLifecycle = function() {
    if (typeof babylon !== 'undefined' && Array.isArray(babylon.renders)) {
      babylon.renders.push(function(delta) {
        self.onFrameUpdate(delta);
      });
    }

    if (typeof babylon !== 'undefined' && typeof babylon.loadMeshes === 'function') {
      var origLoadMeshes = babylon.loadMeshes;
      babylon.loadMeshes = function() {
        return origLoadMeshes.apply(this, arguments).then(function() {
          self.spawnChallengeObjectsInScene();
        });
      };
    }

    if (typeof simPanel !== 'undefined') {
      var origRunSim = simPanel.runSim;
      simPanel.runSim = function() {
        origRunSim.apply(this, arguments);
        if (skulpt.running) {
          self.startChallengeRun();
        } else {
          self.stopChallengeRun(false);
        }
      };

      var origResetSim = simPanel.resetSim;
      simPanel.resetSim = function() {
        self.resetChallengeState();
        return origResetSim.apply(this, arguments);
      };
    }

    var checkReady = setInterval(function() {
      if (typeof babylon !== 'undefined' && babylon.scene && babylon.scene.isReady()) {
        clearInterval(checkReady);
        self.spawnChallengeObjectsInScene();
      }
    }, 300);
  };

  // Spawn 3D START Zone, Glowing Numbered Light Pillars (#1..#N), END Zone, Route Guide Line, Cargo Items, and Drop Zones
  this.spawnChallengeObjectsInScene = function() {
    if (!babylon || !babylon.scene) return;
    var scene = babylon.scene;

    self.checkpointMeshes.forEach(function(m) {
      if (m.pillar) m.pillar.dispose();
      if (m.ring) m.ring.dispose();
      if (m.badge) m.badge.dispose();
    });
    self.cargoMeshes.forEach(function(m) { if (m.mesh) m.mesh.dispose(); });
    self.dropZoneMeshes.forEach(function(m) {
      if (m.mesh) m.mesh.dispose();
      if (m.label) m.label.dispose();
    });
    if (self.startZoneMeshObj) {
      if (self.startZoneMeshObj.pad) self.startZoneMeshObj.pad.dispose();
      if (self.startZoneMeshObj.ring) self.startZoneMeshObj.ring.dispose();
      if (self.startZoneMeshObj.badge) self.startZoneMeshObj.badge.dispose();
      self.startZoneMeshObj = null;
    }
    if (self.endZoneMeshObj) {
      if (self.endZoneMeshObj.pad) self.endZoneMeshObj.pad.dispose();
      if (self.endZoneMeshObj.pillar) self.endZoneMeshObj.pillar.dispose();
      if (self.endZoneMeshObj.ring) self.endZoneMeshObj.ring.dispose();
      if (self.endZoneMeshObj.badge) self.endZoneMeshObj.badge.dispose();
      self.endZoneMeshObj = null;
    }
    if (self.routeGuideLineMesh) {
      self.routeGuideLineMesh.dispose();
      self.routeGuideLineMesh = null;
    }
    if (self.trailMesh) {
      self.trailMesh.dispose();
      self.trailMesh = null;
    }
    if (self.ghostMesh) {
      self.ghostMesh.dispose();
      self.ghostMesh = null;
    }

    self.checkpointMeshes = [];
    self.cargoMeshes = [];
    self.dropZoneMeshes = [];
    self.trailPoints = [];

    if (!self.challengeEnabled || !self.activeChallenge) return;

    var ch = self.activeChallenge;
    var routePoints3D = [];

    // 0. Spawn START Zone (Robot spawn pad - never overlaps checkpoints!)
    var sz = ch.startZone || { pos: [0, 0], size: [16, 16], labelEn: 'START', labelVi: 'START', color: '#0EA5E9' };
    routePoints3D.push(new BABYLON.Vector3(sz.pos[0], 0.22, sz.pos[1]));

    var startPad = BABYLON.MeshBuilder.CreateBox('startZonePad', {
      width: sz.size[0],
      depth: sz.size[1],
      height: 0.25
    }, scene);
    startPad.position = new BABYLON.Vector3(sz.pos[0], 0.14, sz.pos[1]);
    startPad.isPickable = false;
    startPad.isChallengeDynamic = true;

    var startMat = new BABYLON.StandardMaterial('startZoneMat', scene);
    var startCol = babylon.hexToColor3(sz.color || '#0EA5E9');
    startMat.diffuseColor = startCol;
    startMat.emissiveColor = startCol.scale(0.55);
    startMat.alpha = 0.28;
    startPad.material = startMat;

    var startRing = BABYLON.MeshBuilder.CreateTorus('startZoneRing', {
      diameter: Math.max(sz.size[0], sz.size[1]) * 1.15,
      thickness: 0.45,
      tessellation: 28
    }, scene);
    startRing.position = new BABYLON.Vector3(sz.pos[0], 0.28, sz.pos[1]);
    startRing.isPickable = false;
    startRing.isChallengeDynamic = true;
    startRing.material = startMat;

    var startLabelText = self.isVi() ? (sz.labelVi || 'START') : (sz.labelEn || 'START');
    var startBadge = self.createBillboardBadge(scene, startLabelText, sz.color || '#0EA5E9', 11.5, 4.5);
    // Offset slightly behind/above the spawn point so it never covers the robot body
    startBadge.position = new BABYLON.Vector3(sz.pos[0] - 11, 8.5, sz.pos[1] - 8);

    self.startZoneMeshObj = { def: sz, pad: startPad, ring: startRing, badge: startBadge, mat: startMat };

    // 1. Spawn Drop Zones
    (ch.dropZones || []).forEach(function(dz) {
      var zoneMesh = BABYLON.MeshBuilder.CreateBox('dropZone_' + dz.id, {
        width: dz.size[0],
        depth: dz.size[1],
        height: 0.35
      }, scene);
      zoneMesh.position = new BABYLON.Vector3(dz.pos[0], 0.2, dz.pos[1]);
      zoneMesh.isPickable = false;
      zoneMesh.isChallengeDynamic = true;

      var zoneMat = new BABYLON.StandardMaterial('dropZoneMat_' + dz.id, scene);
      var c = babylon.hexToColor3(dz.color || '#F59E0B');
      zoneMat.diffuseColor = c;
      zoneMat.emissiveColor = c.scale(0.5);
      zoneMat.alpha = 0.42;
      zoneMesh.material = zoneMat;

      var dzLabel = self.isVi() ? (dz.labelVi || 'VÙNG THẢ') : (dz.labelEn || 'DROP ZONE');
      var labelPlane = self.createBillboardBadge(scene, dzLabel, dz.color || '#F59E0B', 14, 4.2);
      labelPlane.position = new BABYLON.Vector3(dz.pos[0], 5.5, dz.pos[1]);

      self.dropZoneMeshes.push({ def: dz, mesh: zoneMesh, label: labelPlane });
    });

    // 2. Spawn Glowing Numbered Checkpoints (Light Pillars #1..#N)
    (ch.checkpoints || []).forEach(function(cp, idx) {
      routePoints3D.push(new BABYLON.Vector3(cp.pos[0], 0.22, cp.pos[1]));

      var isCleared = self.clearedCheckpoints.has(cp.number);
      var isNext = !isCleared && (!ch.sequential || idx === self.clearedCheckpoints.size);

      var pillar = BABYLON.MeshBuilder.CreateCylinder('beaconPillar_' + cp.number, {
        height: 16,
        diameterTop: 2.0,
        diameterBottom: 3.0,
        tessellation: 14
      }, scene);
      pillar.position = new BABYLON.Vector3(cp.pos[0], 8, cp.pos[1]);
      pillar.isPickable = false;
      pillar.isChallengeDynamic = true;

      var pillarMat = new BABYLON.StandardMaterial('beaconMat_' + cp.number, scene);
      var baseColor = isCleared
        ? new BABYLON.Color3(0.13, 0.77, 0.37)
        : isNext
        ? new BABYLON.Color3(0.23, 0.51, 0.96)
        : new BABYLON.Color3(0.45, 0.52, 0.62);
      pillarMat.diffuseColor = baseColor;
      pillarMat.emissiveColor = baseColor.scale(0.8);
      pillarMat.alpha = isCleared ? 0.25 : 0.48;
      pillar.material = pillarMat;

      var ring = BABYLON.MeshBuilder.CreateTorus('beaconRing_' + cp.number, {
        diameter: cp.radius * 1.8,
        thickness: 0.4,
        tessellation: 22
      }, scene);
      ring.position = new BABYLON.Vector3(cp.pos[0], 0.35, cp.pos[1]);
      ring.isPickable = false;
      ring.isChallengeDynamic = true;
      ring.material = pillarMat;

      var badge = self.createBillboardBadge(
        scene,
        '#' + cp.number,
        isCleared ? '#16A34A' : '#2563EB',
        7.5,
        5.5
      );
      badge.position = new BABYLON.Vector3(cp.pos[0], 19, cp.pos[1]);

      self.checkpointMeshes.push({
        def: cp,
        pillar: pillar,
        ring: ring,
        badge: badge,
        mat: pillarMat
      });
    });

    // 2b. Spawn END Zone (Finish Target after all Checkpoints)
    if (ch.endZone) {
      var ez = ch.endZone;
      routePoints3D.push(new BABYLON.Vector3(ez.pos[0], 0.22, ez.pos[1]));

      var allCpDone = self.clearedCheckpoints.size >= (ch.checkpoints ? ch.checkpoints.length : 0);
      var endPad = BABYLON.MeshBuilder.CreateBox('endZonePad', {
        width: ez.size ? ez.size[0] : 18,
        depth: ez.size ? ez.size[1] : 18,
        height: 0.3
      }, scene);
      endPad.position = new BABYLON.Vector3(ez.pos[0], 0.18, ez.pos[1]);
      endPad.isPickable = false;
      endPad.isChallengeDynamic = true;

      var endPillar = BABYLON.MeshBuilder.CreateCylinder('endZonePillar', {
        height: 17,
        diameterTop: 2.4,
        diameterBottom: 3.4,
        tessellation: 16
      }, scene);
      endPillar.position = new BABYLON.Vector3(ez.pos[0], 8.5, ez.pos[1]);
      endPillar.isPickable = false;
      endPillar.isChallengeDynamic = true;

      var endMat = new BABYLON.StandardMaterial('endZoneMat', scene);
      var endCol = self.endReached
        ? new BABYLON.Color3(0.09, 0.64, 0.29)
        : allCpDone
        ? new BABYLON.Color3(0.96, 0.62, 0.04)
        : new BABYLON.Color3(0.06, 0.73, 0.51);
      endMat.diffuseColor = endCol;
      endMat.emissiveColor = endCol.scale(0.8);
      endMat.alpha = self.endReached ? 0.3 : allCpDone ? 0.55 : 0.38;
      endPad.material = endMat;
      endPillar.material = endMat;

      var endRing = BABYLON.MeshBuilder.CreateTorus('endZoneRing', {
        diameter: (ez.radius || 12) * 1.85,
        thickness: 0.48,
        tessellation: 26
      }, scene);
      endRing.position = new BABYLON.Vector3(ez.pos[0], 0.36, ez.pos[1]);
      endRing.isPickable = false;
      endRing.isChallengeDynamic = true;
      endRing.material = endMat;

      var endLabelText = self.isVi() ? (ez.labelVi || 'END') : (ez.labelEn || 'END');
      var endBadge = self.createBillboardBadge(scene, endLabelText, '#10B981', 10.5, 5.2);
      endBadge.position = new BABYLON.Vector3(ez.pos[0], 19.5, ez.pos[1]);

      self.endZoneMeshObj = {
        def: ez,
        pad: endPad,
        pillar: endPillar,
        ring: endRing,
        badge: endBadge,
        mat: endMat
      };
    }

    // 2c. Draw subtle 3D Route Guide Line (START -> #1 -> #2 ... -> END) on the arena floor
    if (routePoints3D.length >= 2) {
      self.routeGuideLineMesh = BABYLON.MeshBuilder.CreateDashedLines('challengeRouteGuide', {
        points: routePoints3D,
        dashSize: 2.5,
        gapSize: 1.5,
        dashNb: 90
      }, scene);
      self.routeGuideLineMesh.color = new BABYLON.Color3(0.22, 0.55, 0.96);
      self.routeGuideLineMesh.alpha = 0.65;
      self.routeGuideLineMesh.isPickable = false;
      self.routeGuideLineMesh.isChallengeDynamic = true;
    }

    // 3. Spawn Interactive Cargo Items (Magnetic / Graspable)
    (ch.cargoItems || []).forEach(function(cargo) {
      var cargoMesh = BABYLON.MeshBuilder.CreateBox('cargo_' + cargo.id, {
        width: cargo.size[0],
        height: cargo.size[1],
        depth: cargo.size[2]
      }, scene);
      cargoMesh.position = new BABYLON.Vector3(cargo.pos[0], cargo.size[1] / 2 + 0.5, cargo.pos[1]);
      cargoMesh.isPickable = true;
      cargoMesh.isMagnetic = cargo.type === 'magnetic';
      cargoMesh.isGraspable = true;
      cargoMesh.isChallengeDynamic = true;

      var cargoMat = new BABYLON.StandardMaterial('cargoMat_' + cargo.id, scene);
      var col = babylon.hexToColor3(cargo.color || '#F59E0B');
      cargoMat.diffuseColor = col;
      cargoMat.emissiveColor = col.scale(0.35);
      cargoMesh.material = cargoMat;
      cargoMesh.rttMaterial = cargoMat;

      cargoMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        cargoMesh,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {
          mass: 35,
          friction: 0.5,
          restitution: 0.1
        },
        scene
      );

      self.cargoMeshes.push({ def: cargo, mesh: cargoMesh, delivered: false });
    });

    // 4. Create Ghost Robot mesh if a best run exists for this challenge
    if (self.bestGhostFrames[ch.id] && self.bestGhostFrames[ch.id].length > 0) {
      var ghost = BABYLON.MeshBuilder.CreateBox('ghostRobotMesh', {
        width: 10,
        height: 4.2,
        depth: 14
      }, scene);
      var ghostMat = new BABYLON.StandardMaterial('ghostRobotMat', scene);
      ghostMat.diffuseColor = new BABYLON.Color3(0.28, 0.58, 0.98);
      ghostMat.emissiveColor = new BABYLON.Color3(0.28, 0.58, 0.98);
      ghostMat.alpha = 0.25;
      ghost.material = ghostMat;
      ghost.isPickable = false;
      ghost.isChallengeDynamic = true;
      ghost.setEnabled(self.ghostEnabled);
      self.ghostMesh = ghost;
    }

    self.renderHudCheckpoints();
  };

  this.createBillboardBadge = function(scene, text, hexColor, width, height) {
    var plane = BABYLON.MeshBuilder.CreatePlane('badge_' + text, { width: width, height: height }, scene);
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    plane.isPickable = false;
    plane.isChallengeDynamic = true;

    var texW = text.length > 4 ? 384 : 256;
    var texH = 128;
    var dt = new BABYLON.DynamicTexture('badgeTex_' + text, { width: texW, height: texH }, scene, false);
    dt.hasAlpha = true;
    var ctx = dt.getContext();
    ctx.clearRect(0, 0, texW, texH);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 8;
    ctx.fillRect(8, 8, texW - 16, texH - 16);
    ctx.strokeRect(8, 8, texW - 16, texH - 16);

    var fontSize = text.length > 6 ? 46 : text.length > 3 ? 52 : 60;
    ctx.font = 'bold ' + fontSize + 'px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, texW / 2, texH / 2 + 2);
    dt.update();

    var mat = new BABYLON.StandardMaterial('badgeMat_' + text, scene);
    mat.diffuseTexture = dt;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    plane.material = mat;

    return plane;
  };

  this.startChallengeRun = function() {
    self.timerRunning = true;
    self.startTimeMs = performance.now();
    self.elapsedMs = 0;
    self.score = 0;
    self.clearedCheckpoints.clear();
    self.deliveredCargoIds.clear();
    self.endReached = false;
    self.currentRecording = [];
    self.trailPoints = [];
    $('#wroMissionStatus').text(self.t('Departed START — Navigating route...', 'Đã rời START — Đang di chuyển theo lộ trình...'));
    self.updateCheckpointVisuals();
    self.renderHudCheckpoints();
  };

  this.stopChallengeRun = function(completed) {
    self.timerRunning = false;
    if (completed) {
      var timeSec = (self.elapsedMs / 1000).toFixed(2);
      var msg = self.t(
        'Reached END in ' + timeSec + 's (' + self.score + ' pts)!',
        'Đã về đích END trong ' + timeSec + 's (' + self.score + ' điểm)!'
      );
      $('#wroMissionStatus').text(msg);
      if (typeof toastMsg === 'function') {
        toastMsg(msg);
      }

      var chId = self.activeChallenge.id;
      var prevBest = self.bestGhostFrames[chId];
      if (!prevBest || !prevBest.totalTimeMs || self.elapsedMs < prevBest.totalTimeMs) {
        self.bestGhostFrames[chId] = self.currentRecording.slice(0, 1200);
        try {
          localStorage.setItem('gearsBestGhosts', JSON.stringify(self.bestGhostFrames));
        } catch (e) {}
      }

      var playerName = ($('#projectName').val() || '').trim() || 'Team WRO';
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: chId,
          playerName: playerName,
          robotName: (robot && robot.options && robot.options.name) || 'spikePrimeWRO',
          timeMs: Math.round(self.elapsedMs),
          score: self.score,
          mode: self.roomState ? self.roomState.mode : 'single'
        })
      }).catch(function() {});

      if (self.ws && self.ws.readyState === 1 && self.roomState) {
        self.ws.send(JSON.stringify({
          type: 'relay_stage_complete',
          elapsedMs: self.elapsedMs,
          score: self.score
        }));
      }
    }
  };

  this.resetChallengeState = function() {
    self.timerRunning = false;
    self.elapsedMs = 0;
    self.score = 0;
    self.clearedCheckpoints.clear();
    self.deliveredCargoIds.clear();
    self.endReached = false;
    self.currentRecording = [];
    self.trailPoints = [];
    $('#wroTimerDisplay').text('00:00.00');
    $('#wroSideTimer').text('00:00.000');
    $('#wroScoreDisplay, #wroSideScore').text('0');
    $('#wroMissionStatus').text(self.t('Ready at START — Click Run to start', 'Sẵn sàng tại START — Nhấn Chạy để xuất phát'));
    self.updateCheckpointVisuals();
    self.renderHudCheckpoints();
  };

  this.updateCheckpointVisuals = function() {
    var ch = self.activeChallenge;
    if (!ch) return;
    self.checkpointMeshes.forEach(function(item, idx) {
      var isCleared = self.clearedCheckpoints.has(item.def.number);
      var isNext = !isCleared && (!ch.sequential || idx === self.clearedCheckpoints.size);
      var col = isCleared
        ? new BABYLON.Color3(0.13, 0.77, 0.37)
        : isNext
        ? new BABYLON.Color3(0.23, 0.51, 0.96)
        : new BABYLON.Color3(0.45, 0.52, 0.62);
      if (item.mat) {
        item.mat.diffuseColor = col;
        item.mat.emissiveColor = col.scale(0.8);
        item.mat.alpha = isCleared ? 0.22 : isNext ? 0.52 : 0.32;
      }
    });

    if (self.endZoneMeshObj && self.endZoneMeshObj.mat) {
      var allCpDone = self.clearedCheckpoints.size >= (ch.checkpoints ? ch.checkpoints.length : 0);
      var allCargoDone = self.deliveredCargoIds.size >= (ch.cargoItems ? ch.cargoItems.length : 0);
      var endCol = self.endReached
        ? new BABYLON.Color3(0.09, 0.64, 0.29)
        : (allCpDone && allCargoDone)
        ? new BABYLON.Color3(0.96, 0.62, 0.04)
        : new BABYLON.Color3(0.06, 0.73, 0.51);
      self.endZoneMeshObj.mat.diffuseColor = endCol;
      self.endZoneMeshObj.mat.emissiveColor = endCol.scale(0.8);
      self.endZoneMeshObj.mat.alpha = self.endReached ? 0.28 : (allCpDone && allCargoDone) ? 0.58 : 0.38;
    }
  };

  this.renderHudCheckpoints = function() {
    var $strip = $('#wroBeaconsStrip');
    var $topBeacons = $('#wroTopBeacons');
    if (!$strip.length || !self.activeChallenge) return;

    $('#wroChallengeDescText').text(self.getChallengeDesc(self.activeChallenge));
    $strip.empty();
    $topBeacons.empty();

    var svgCheck = '<svg style="display:inline-block; vertical-align:middle; margin-right:2px;" viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 8 6 12 13 4"/></svg>';

    var ch = self.activeChallenge;

    // 1. START Pill
    var szPos = (ch.startZone && ch.startZone.pos) ? ch.startZone.pos : [0, 0];
    var startActive = self.timerRunning || self.clearedCheckpoints.size > 0 || self.endReached;
    var startCls = 'gb-beacon-pill' + (startActive ? ' cleared' : ' next');
    var startPill = '<span class="' + startCls + '" title="START (' + szPos[0] + ', ' + szPos[1] + ')">' + (startActive ? svgCheck : '') + 'START</span>';
    $strip.append(startPill);
    $topBeacons.append(startPill);

    // 2. Numbered Checkpoints (#1..#N)
    (ch.checkpoints || []).forEach(function(cp, idx) {
      var isCleared = self.clearedCheckpoints.has(cp.number);
      var isNext = !isCleared && (!ch.sequential || idx === self.clearedCheckpoints.size);
      var cls = 'gb-beacon-pill' + (isCleared ? ' cleared' : isNext ? ' next' : '');
      var label = isCleared ? svgCheck + cp.number : '#' + cp.number;
      var pill = '<span class="' + cls + '" title="Beacon #' + cp.number + ' (' + cp.pos[0] + ', ' + cp.pos[1] + ')">' + label + '</span>';
      $strip.append(pill);
      $topBeacons.append(pill);
    });

    // 3. Cargo Items (if any)
    (ch.cargoItems || []).forEach(function(c) {
      var delivered = self.deliveredCargoIds.has(c.id);
      var cls = 'gb-beacon-pill' + (delivered ? ' cleared' : ' next');
      var cLabel = self.isVi() ? c.labelVi : c.labelEn;
      var pill = '<span class="' + cls + '">' + (delivered ? svgCheck : '') + cLabel + '</span>';
      $strip.append(pill);
      $topBeacons.append(pill);
    });

    // 4. END Pill
    if (ch.endZone) {
      var allCheckpointsDone = self.clearedCheckpoints.size >= (ch.checkpoints ? ch.checkpoints.length : 0);
      var allCargoDone = self.deliveredCargoIds.size >= (ch.cargoItems ? ch.cargoItems.length : 0);
      var endIsNext = !self.endReached && allCheckpointsDone && allCargoDone;
      var endCls = 'gb-beacon-pill' + (self.endReached ? ' cleared' : endIsNext ? ' next' : '');
      var endPill = '<span class="' + endCls + '" title="END (' + ch.endZone.pos[0] + ', ' + ch.endZone.pos[1] + ')">' + (self.endReached ? svgCheck : '') + 'END</span>';
      $strip.append(endPill);
      $topBeacons.append(endPill);
    }

    $('#wroScoreDisplay, #wroSideScore').text(String(self.score));
  };

  this.formatTime = function(ms, shortForm) {
    var totalMs = Math.max(0, Math.floor(ms));
    var mins = Math.floor(totalMs / 60000);
    var secs = Math.floor((totalMs % 60000) / 1000);
    if (shortForm) {
      var hundredths = Math.floor((totalMs % 1000) / 10);
      return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(hundredths).padStart(2, '0');
    }
    var millis = totalMs % 1000;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(millis).padStart(3, '0');
  };

  this.onFrameUpdate = function(delta) {
    if (!robot || !robot.body || !babylon || !babylon.scene) return;

    var now = performance.now();
    var pos = robot.body.position;
    var quat = robot.body.absoluteRotationQuaternion;
    var headingDeg = 0;
    if (quat) {
      var euler = quat.toEulerAngles();
      headingDeg = (euler.y / Math.PI) * 180;
    }

    if (self.timerRunning && skulpt && skulpt.running) {
      self.elapsedMs = now - self.startTimeMs;
      $('#wroTimerDisplay').text(self.formatTime(self.elapsedMs, true));
      $('#wroSideTimer').text(self.formatTime(self.elapsedMs, false));

      var ch = self.activeChallenge;
      if (ch && self.challengeEnabled) {
        for (var i = 0; i < ch.checkpoints.length; i++) {
          var cp = ch.checkpoints[i];
          if (self.clearedCheckpoints.has(cp.number)) continue;
          if (ch.sequential && i > self.clearedCheckpoints.size) break;

          var dx = pos.x - cp.pos[0];
          var dz = pos.z - cp.pos[1];
          var dist = Math.sqrt(dx * dx + dz * dz);
          if (dist <= cp.radius) {
            self.clearedCheckpoints.add(cp.number);
            self.score += cp.points || 100;
            self.updateCheckpointVisuals();
            self.renderHudCheckpoints();
            var isLastCp = self.clearedCheckpoints.size >= ch.checkpoints.length;
            $('#wroMissionStatus').text(
              self.t('Cleared Beacon #' + cp.number, 'Đã qua Cột sáng #' + cp.number) +
              ' (+' + (cp.points || 100) + ')' +
              (isLastCp && ch.endZone ? self.t(' → Proceed to END!', ' → Tiến về đích END!') : '')
            );

            if (self.ws && self.ws.readyState === 1 && self.roomState) {
              self.ws.send(JSON.stringify({
                type: 'checkpoint_cleared',
                checkpointNumber: cp.number,
                points: cp.points || 100
              }));
              if (cp.handoffAfter && self.roomState.mode === 'relay') {
                self.ws.send(JSON.stringify({
                  type: 'relay_stage_complete',
                  elapsedMs: self.elapsedMs,
                  score: self.score
                }));
              }
            }
          }
        }

        if (ch.dropZones && ch.dropZones.length > 0 && self.cargoMeshes.length > 0) {
          self.cargoMeshes.forEach(function(cObj) {
            if (self.deliveredCargoIds.has(cObj.def.id) || !cObj.mesh) return;
            var cPos = cObj.mesh.getAbsolutePosition();
            ch.dropZones.forEach(function(dz) {
              var inX = Math.abs(cPos.x - dz.pos[0]) <= dz.size[0] / 2;
              var inZ = Math.abs(cPos.z - dz.pos[1]) <= dz.size[1] / 2;
              if (inX && inZ) {
                self.deliveredCargoIds.add(cObj.def.id);
                self.score += cObj.def.points || 250;
                self.updateCheckpointVisuals();
                self.renderHudCheckpoints();
                $('#wroMissionStatus').text(self.t('Delivered cargo! Proceed to END!', 'Đã thả vật phẩm! Tiến về đích END!'));
              }
            });
          });
        }

        var allCheckpointsDone = self.clearedCheckpoints.size >= ch.checkpoints.length;
        var allCargoDone = self.deliveredCargoIds.size >= (ch.cargoItems ? ch.cargoItems.length : 0);

        if (allCheckpointsDone && allCargoDone) {
          if (ch.endZone) {
            if (!self.endReached) {
              var edx = pos.x - ch.endZone.pos[0];
              var edz = pos.z - ch.endZone.pos[1];
              var edist = Math.sqrt(edx * edx + edz * edz);
              if (edist <= (ch.endZone.radius || 12)) {
                self.endReached = true;
                self.score += ch.endZone.points || 200;
                self.updateCheckpointVisuals();
                self.renderHudCheckpoints();
                self.stopChallengeRun(true);
              }
            }
          } else {
            self.stopChallengeRun(true);
          }
        }
      }

      if (now - self.lastGhostSampleMs >= 60) {
        self.lastGhostSampleMs = now;
        self.currentRecording.push({
          t: Math.round(self.elapsedMs),
          x: Number(pos.x.toFixed(2)),
          y: Number(pos.y.toFixed(2)),
          z: Number(pos.z.toFixed(2)),
          rotY: Number((quat ? quat.toEulerAngles().y : 0).toFixed(3))
        });
      }

      if (self.ghostEnabled && self.ghostMesh && ch && self.bestGhostFrames[ch.id]) {
        var frames = self.bestGhostFrames[ch.id];
        var gIdx = Math.min(frames.length - 1, Math.floor(self.elapsedMs / 60));
        var gf = frames[gIdx];
        if (gf) {
          self.ghostMesh.position.set(gf.x, gf.y, gf.z);
          self.ghostMesh.rotation.y = gf.rotY;
        }
      }
    }

    if (self.trailEnabled && skulpt && skulpt.running && now - self.lastTrailSampleMs >= 90) {
      self.lastTrailSampleMs = now;
      var lastPt = self.trailPoints[self.trailPoints.length - 1];
      var curPt = new BABYLON.Vector3(pos.x, 0.25, pos.z);
      if (!lastPt || BABYLON.Vector3.Distance(lastPt, curPt) > 1.2) {
        self.trailPoints.push(curPt);
        if (self.trailPoints.length > 260) {
          self.trailPoints.shift();
        }
        if (self.trailPoints.length >= 2) {
          if (self.trailMesh) {
            self.trailMesh.dispose();
          }
          self.trailMesh = BABYLON.MeshBuilder.CreateLines('robotOdometryTrail', {
            points: self.trailPoints,
            updatable: false
          }, babylon.scene);
          self.trailMesh.color = new BABYLON.Color3(0.28, 0.58, 0.98);
          self.trailMesh.isPickable = false;
          self.trailMesh.isChallengeDynamic = true;
        }
      }
    }

    if (!self.lastTelemetryMs || now - self.lastTelemetryMs >= 60) {
      self.lastTelemetryMs = now;
      self.updateTelemetryAndPlotter(pos, headingDeg);
    }

    if (self.ws && self.ws.readyState === 1 && self.roomState && now - self.lastPoseSentMs >= 50) {
      self.lastPoseSentMs = now;
      var clawComp = robot.getComponentByPort('outC');
      var magComp = robot.getComponentByPort('outD');
      self.ws.send(JSON.stringify({
        type: 'pose_update',
        pose: {
          x: Number(pos.x.toFixed(2)),
          y: Number(pos.y.toFixed(2)),
          z: Number(pos.z.toFixed(2)),
          rotY: Number(((headingDeg * Math.PI) / 180).toFixed(3)),
          clawClosed: Boolean(clawComp && clawComp.position > 25),
          magnetOn: Boolean(magComp && Math.abs(magComp.power) > 10)
        }
      }));
    }
  };

  this.updateTelemetryAndPlotter = function(pos, headingDeg) {
    $('#wroOdomXZ').text(pos.x.toFixed(1) + ', ' + pos.z.toFixed(1));
    $('#wroOdomHeading').text(headingDeg.toFixed(1) + '°');

    var s1 = robot.getComponentByPort('in1');
    var s2 = robot.getComponentByPort('in2');
    var refL = 100;
    var refR = 100;
    if (s1 && s1.type === 'ColorSensor' && s1.cachedRGB) {
      refL = Math.round(((s1.cachedRGB[0] + s1.cachedRGB[1] + s1.cachedRGB[2]) / (3 * 255)) * 100);
    }
    if (s2 && s2.type === 'ColorSensor' && s2.cachedRGB) {
      refR = Math.round(((s2.cachedRGB[0] + s2.cachedRGB[1] + s2.cachedRGB[2]) / (3 * 255)) * 100);
    }
    $('#wroOdomColor').text(refL + '% / ' + refR + '%');

    var claw = robot.getComponentByPort('outC');
    var magnet = robot.getComponentByPort('outD');
    var clawTxt = claw && claw.position > 25 ? self.t('Closed', 'Kẹp') : self.t('Open', 'Mở');
    var magTxt = magnet && Math.abs(magnet.power) > 10 ? self.t('ON', 'Bật') : self.t('OFF', 'Tắt');
    $('#wroOdomActuator').text(clawTxt + ' / ' + magTxt);

    if (babylon && babylon.engine) {
      var fps = Math.round(babylon.engine.getFps());
      $('#wroFpsReadout').text(fps + ' FPS');
    }

    var pidError = 50 - refL;
    self.telemetryHistory.push({ refL: refL, refR: refR, error: pidError });
    if (self.telemetryHistory.length > self.MAX_TELEMETRY_POINTS) {
      self.telemetryHistory.shift();
    }

    var canvas = document.getElementById('wroPidCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    if (self.telemetryHistory.length < 2) return;

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (var i = 0; i < self.telemetryHistory.length; i++) {
      var x = (i / (self.MAX_TELEMETRY_POINTS - 1)) * w;
      var y = h - (self.telemetryHistory[i].refL / 100) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (var j = 0; j < self.telemetryHistory.length; j++) {
      var x2 = (j / (self.MAX_TELEMETRY_POINTS - 1)) * w;
      var normErr = (self.telemetryHistory[j].error + 50) / 100;
      var y2 = h - normErr * (h - 10) - 5;
      if (j === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  };

  this.selectChallengeById = function(challengeId, loadSampleCode) {
    var found = self.challenges.find(function(c) { return c.id === challengeId; });
    if (!found) return;
    self.activeChallenge = found;
    self.challengeEnabled = true;
    $('#wroSelectChallenge').val(found.id);

    var targetWorld = worlds.find(function(w) { return w.name === found.worldName; });
    if (targetWorld && babylon) {
      babylon.world = targetWorld;
    }

    var recRobot = robotTemplates.find(function(r) { return r.name === found.recommendedRobot; });
    if (recRobot && robot) {
      robot.options = JSON.parse(JSON.stringify(recRobot));
      $('#wroSelectRobotPreset').val(recRobot.name);
    }

    self.resetChallengeState();
    if (babylon && babylon.world) {
      babylon.world.setOptions().then(function() {
        return babylon.resetScene();
      }).then(function() {
        if (typeof simPanel !== 'undefined') simPanel.initSensorsPanel();
      });
    }

    if (loadSampleCode) {
      self.loadRecommendedCodeForActiveChallenge();
    }
  };

  this.loadRecommendedCodeForActiveChallenge = function() {
    if (!self.activeChallenge) return;
    var map = {
      'wro-beacon-sprint': 'beacon-nav',
      'fll-magnetic-rescue': 'magnet-rescue',
      'spike-claw-logistics': 'claw-logistics',
      'wro-pid-line-master': 'pid-line',
      'team-relay-marathon': 'beacon-nav'
    };
    var tplKey = map[self.activeChallenge.id] || 'beacon-nav';
    $('#wroSelectCodeTpl').val(tplKey);
    self.applyPythonTemplate(tplKey);
  };

  this.applyPythonTemplate = function(tplKey) {
    var tpl = self.codeTemplates[tplKey];
    if (!tpl) return;
    if (typeof filesManager !== 'undefined') {
      var fileName = tplKey + '.py';
      if (!(fileName in filesManager.files)) {
        filesManager.add(fileName, tpl.code);
      } else {
        filesManager.files[fileName] = tpl.code;
      }
      filesManager.select(fileName);
      if (typeof pythonPanel !== 'undefined' && pythonPanel.editor) {
        pythonPanel.editor.setValue(tpl.code, -1);
      }
    }
    if (typeof toastMsg === 'function') {
      toastMsg(self.t('Loaded Python template: ', 'Đã nạp chương trình mẫu: ') + (self.isVi() ? tpl.titleVi : tpl.titleEn));
    }
  };

  // Native GearsBot Dialog for Leaderboard
  this.openLeaderboardModal = function() {
    var chId = (self.activeChallenge && self.activeChallenge.id) || 'wro-beacon-sprint';
    var title = self.t('Leaderboard — ', 'Bảng Xếp Hạng — ') + self.getChallengeTitle(self.activeChallenge);

    var $body = $(`
      <div style="padding: 0.4em 0;">
        <table class="gb-data-table" style="color:#333;">
          <thead>
            <tr>
              <th>#</th>
              <th>${self.t('Team / Player', 'Đội / Người chơi')}</th>
              <th>Robot</th>
              <th>${self.t('Score', 'Điểm')}</th>
              <th>${self.t('Time', 'Thời gian')}</th>
            </tr>
          </thead>
          <tbody id="wroLeaderboardRows">
            <tr><td colspan="5">${self.t('Loading...', 'Đang tải...')}</td></tr>
          </tbody>
        </table>
      </div>
    `);

    var $buttons = $('<button type="button" class="confirm btn-success">OK</button>');
    var $dialog = dialog(title, $body, $buttons);
    $buttons.on('click', function() { $dialog.close(); });

    fetch('/api/leaderboard?challengeId=' + encodeURIComponent(chId))
      .then(function(r) { return r.json(); })
      .then(function(rows) {
        var $tbody = $body.find('#wroLeaderboardRows');
        $tbody.empty();
        if (!Array.isArray(rows) || rows.length === 0) {
          $tbody.append('<tr><td colspan="5">' + self.t('No records yet. Run the simulator to set the first record!', 'Chưa có kỷ lục nào. Hãy chạy Robot để ghi kỷ lục đầu tiên!') + '</td></tr>');
          return;
        }
        rows.forEach(function(r, idx) {
          $tbody.append(
            '<tr>' +
              '<td>#' + (idx + 1) + '</td>' +
              '<td><strong>' + r.playerName + '</strong></td>' +
              '<td>' + r.robotName + '</td>' +
              '<td>' + r.score + '</td>' +
              '<td class="val">' + self.formatTime(r.timeMs, false) + '</td>' +
            '</tr>'
          );
        });
      });
  };

  // WebSocket Real-Time Multiplayer (Duel & Team Relay) inside Tab 4
  this.connectWebSocket = function() {
    var proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var wsUrl = proto + '//' + window.location.host;
    try {
      self.ws = new WebSocket(wsUrl);
    } catch (e) {
      return;
    }

    self.ws.onmessage = function(ev) {
      var msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        return;
      }

      if (msg.type === 'connected') {
        self.clientId = msg.clientId;
      } else if (msg.type === 'room_joined' || msg.type === 'room_state') {
        self.roomState = msg.room;
        if (typeof msg.slot === 'number') {
          self.mySlot = msg.slot;
        }
        self.updateRoomUiState();
      } else if (msg.type === 'room_error') {
        if (typeof toastMsg === 'function') toastMsg(msg.message);
      } else if (msg.type === 'remote_pose') {
        self.renderRemotePlayerPose(msg);
      } else if (msg.type === 'match_started') {
        self.roomState = msg.room;
        self.updateRoomUiState();
        self.handleMultiplayerMatchStart(msg);
      } else if (msg.type === 'relay_handoff') {
        self.roomState = msg.room;
        self.updateRoomUiState();
        self.handleRelayHandoff(msg);
      } else if (msg.type === 'match_finished') {
        self.roomState = msg.room;
        self.updateRoomUiState();
        if (typeof toastMsg === 'function') {
          toastMsg(self.t('Match finished! Winner: ', 'Trận đấu hoàn tất! Đội thắng: ') + msg.winnerName + ' (' + self.formatTime(msg.elapsedMs, false) + ')');
        }
      }
    };

    self.ws.onclose = function() {
      setTimeout(function() { self.connectWebSocket(); }, 3000);
    };
  };

  this.handleMultiplayerMatchStart = function(msg) {
    $('#navSim').trigger('click');
    if (self.roomState.mode === 'duel') {
      if (typeof toastMsg === 'function') toastMsg(self.t('DUEL started — All robots go!', 'Chế độ DUEL bắt đầu — Xuất phát!'));
      if (!skulpt.running && typeof simPanel !== 'undefined') {
        simPanel.runSim();
      }
    } else if (self.roomState.mode === 'relay') {
      if (self.mySlot === msg.activeRelayStage) {
        if (typeof toastMsg === 'function') toastMsg(self.t('Stage 1 started — Your robot is live!', 'Chặng 1 bắt đầu — Robot của bạn xuất phát!'));
        if (!skulpt.running && typeof simPanel !== 'undefined') {
          simPanel.runSim();
        }
      } else {
        if (typeof toastMsg === 'function') {
          toastMsg(self.t('Relay started! Waiting for Stage ', 'Tiếp sức bắt đầu! Đang chờ Chặng ') + (msg.activeRelayStage + 1) + '...');
        }
      }
    }
  };

  this.handleRelayHandoff = function(msg) {
    if (typeof toastMsg === 'function') {
      toastMsg(self.t('Relay Handoff! Stage ', 'Chuyển giao Tiếp sức! Chặng ') + (msg.activeRelayStage + 1) + self.t(' unlocked!', ' được kích hoạt!'));
    }
    if (self.mySlot === msg.activeRelayStage) {
      if (!skulpt.running && typeof simPanel !== 'undefined') {
        simPanel.runSim();
      }
    }
  };

  this.renderRemotePlayerPose = function(msg) {
    if (!babylon || !babylon.scene || msg.clientId === self.clientId) return;
    var scene = babylon.scene;
    var rMesh = self.remoteRobotMeshes[msg.clientId];
    if (!rMesh || rMesh.isDisposed()) {
      rMesh = BABYLON.MeshBuilder.CreateBox('remoteBot_' + msg.clientId, {
        width: 10.4,
        height: 4.2,
        depth: 14.5
      }, scene);
      var mat = new BABYLON.StandardMaterial('remoteBotMat_' + msg.clientId, scene);
      var col = babylon.hexToColor3(msg.color || '#4994FB');
      mat.diffuseColor = col;
      mat.emissiveColor = col.scale(0.35);
      rMesh.material = mat;
      rMesh.isPickable = false;
      rMesh.isChallengeDynamic = true;

      var badge = self.createBillboardBadge(scene, msg.name || ('Bot ' + (msg.slot + 1)), msg.color || '#4994FB', 10, 3.8);
      badge.parent = rMesh;
      badge.position.y = 6.5;

      self.remoteRobotMeshes[msg.clientId] = rMesh;
    }

    if (msg.pose) {
      rMesh.position.x = msg.pose.x;
      rMesh.position.y = msg.pose.y || 2.2;
      rMesh.position.z = msg.pose.z;
      rMesh.rotation.y = msg.pose.rotY || 0;
    }
  };

  this.updateRoomUiState = function() {
    if (!self.roomState) {
      $('#wroRoomBadge').text('Solo');
    } else {
      var modeTxt = self.roomState.mode === 'relay' ? 'Relay' : 'Duel';
      $('#wroRoomBadge').text(self.roomState.roomCode + ' (' + modeTxt + ' #' + (self.mySlot + 1) + ')');
    }

    var $container = $('#wroMultiplayerPaneContent');
    if ($container.length) {
      self.renderMultiplayerRoomBody($container);
    }
  };

  this.renderMultiplayerRoomBody = function($container) {
    if (!$container || !$container.length) return;
    $container.empty();

    if (!self.roomState) {
      var defaultName = ($('#projectName').val() || '').trim() || 'Player_' + Math.floor(Math.random() * 90 + 10);
      $container.html(`
        <div class="gb-box">
          <div class="gb-box-title">
            <span>${self.t('Create Realtime Room', 'Tạo Phòng Đồng Bộ Realtime')}</span>
          </div>
          <div class="gb-row">
            <span>${self.t('Name:', 'Tên:')}</span>
            <input type="text" id="wroMpName" class="gb-input" style="width:170px;" value="${defaultName}">
          </div>
          <div class="gb-row">
            <span>${self.t('Mode:', 'Chế độ:')}</span>
            <select id="wroMpMode" class="gb-select" style="width:170px;">
              <option value="relay">${self.t('Team Relay (Stages)', 'Tiếp sức theo chặng')}</option>
              <option value="duel">${self.t('Head-to-Head Duel', 'Đua đối kháng (Duel)')}</option>
            </select>
          </div>
          <div class="gb-btn-row">
            <button type="button" class="gb-btn primary" id="wroBtnCreateRoom">${self.t('Create Room Code', 'Tạo Mã Phòng Mới')}</button>
          </div>
        </div>

        <div class="gb-box">
          <div class="gb-box-title">
            <span>${self.t('Join Existing Room', 'Vào Phòng Bằng Mã Code')}</span>
          </div>
          <div class="gb-row">
            <input type="text" id="wroMpJoinCode" class="gb-input" placeholder="${self.t('6-char Code (e.g. WRO26A)', 'Mã 6 ký tự (VD: WRO26A)')}" style="text-transform:uppercase; flex:1;">
            <button type="button" class="gb-btn primary" id="wroBtnJoinRoom" style="flex:0 0 76px; width:76px;">${self.t('Join', 'Vào')}</button>
          </div>
        </div>

        <div class="gb-box">
          <div class="gb-box-title">
            <span>${self.t('Local Multi-Bot Arena', 'Đấu trường 4 Robot trên 1 máy')}</span>
          </div>
          <div class="gb-btn-row">
            <button type="button" class="gb-btn" id="wroBtnOpenLocalArena">${self.t('Open Multi-Bot Arena', 'Mở Arena 4 Robot (arena.html)')}</button>
          </div>
        </div>
      `);

      $container.find('#wroBtnCreateRoom').on('click', function() {
        if (!self.ws || self.ws.readyState !== 1) return;
        self.ws.send(JSON.stringify({
          type: 'create_room',
          playerName: $container.find('#wroMpName').val(),
          mode: $container.find('#wroMpMode').val(),
          challengeId: self.activeChallenge ? self.activeChallenge.id : 'team-relay-marathon',
          robotTemplate: (robot && robot.options && robot.options.name) || 'spikePrimeWRO'
        }));
      });

      $container.find('#wroBtnJoinRoom').on('click', function() {
        if (!self.ws || self.ws.readyState !== 1) return;
        var code = ($container.find('#wroMpJoinCode').val() || '').trim().toUpperCase();
        if (!code) return;
        self.ws.send(JSON.stringify({
          type: 'join_room',
          roomCode: code,
          playerName: $container.find('#wroMpName').val() || 'Teammate',
          robotTemplate: (robot && robot.options && robot.options.name) || 'spikePrimeWRO'
        }));
      });

      $container.find('#wroBtnOpenLocalArena').on('click', function() {
        if (typeof main !== 'undefined' && typeof main.openPage === 'function') {
          main.openPage('arena.html');
        }
      });
      return;
    }

    var rm = self.roomState;
    var rows = (rm.players || []).map(function(p) {
      var isMe = p.clientId === self.clientId;
      return (
        '<tr>' +
          '<td>#' + (p.slot + 1) + '</td>' +
          '<td><strong>' + p.name + (isMe ? ' *' : '') + '</strong></td>' +
          '<td class="val">' + p.score + '</td>' +
        '</tr>'
      );
    }).join('');

    $container.html(`
      <div class="gb-box">
        <div class="gb-box-title">
          <span>${self.t('Room Code:', 'Mã Phòng:')} <strong style="color:#2563EB; font-family:monospace; font-size:115%;">${rm.roomCode}</strong></span>
          <span>${rm.mode === 'relay' ? 'Relay' : 'Duel'}</span>
        </div>
        <div class="gb-row">
          <span>${self.t('Your Stage:', 'Chặng của bạn:')}</span>
          <select id="wroRoomSlotSelect" class="gb-select" style="width:145px;">
            <option value="0" ${self.mySlot === 0 ? 'selected' : ''}>${self.t('Stage 1 (Start)', 'Chặng 1 (Mở màn)')}</option>
            <option value="1" ${self.mySlot === 1 ? 'selected' : ''}>${self.t('Stage 2 (Relay)', 'Chặng 2 (Tiếp sức)')}</option>
            <option value="2" ${self.mySlot === 2 ? 'selected' : ''}>${self.t('Stage 3', 'Chặng 3')}</option>
            <option value="3" ${self.mySlot === 3 ? 'selected' : ''}>${self.t('Stage 4', 'Chặng 4')}</option>
          </select>
        </div>
        <table class="gb-data-table">
          <thead>
            <tr>
              <th>${self.t('Stg', 'Chặng')}</th>
              <th>${self.t('Player', 'Thành viên')}</th>
              <th>${self.t('Pts', 'Điểm')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="gb-btn-row">
          <button type="button" class="gb-btn primary" id="wroBtnStartMultiplayerMatch">${self.t('Start Synchronized Match', 'Phát Lệnh Xuất Phát Chung')}</button>
        </div>
      </div>
    `);

    $container.find('#wroRoomSlotSelect').on('change', function() {
      var newSlot = parseInt($(this).val(), 10);
      self.mySlot = newSlot;
      if (self.ws && self.ws.readyState === 1) {
        self.ws.send(JSON.stringify({ type: 'update_player', slot: newSlot }));
      }
    });

    $container.find('#wroBtnStartMultiplayerMatch').on('click', function() {
      if (self.ws && self.ws.readyState === 1) {
        self.ws.send(JSON.stringify({ type: 'start_match' }));
      }
    });
  };
})();

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    wroSuite.init();
  }, 100);
});
