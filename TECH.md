# Phân Tích Công Nghệ - Gears Robot Simulator

## Tổng Quan Dự Án

**Gears** (Generic Educational Autonomous Robotics Simulator) là một trình giả lập robot giáo dục được phát triển để cho phép mọi người thử nghiệm với robotics mà không cần sở hữu robot thật. Dự án này là một ứng dụng web tĩnh (static web application) chạy hoàn toàn trên client-side, không cần backend server.

- **Mục đích**: Giả lập robot LEGO Mindstorms EV3 trong trình duyệt
- **API tương thích**: Ev3dev API và Pybricks (hỗ trợ sớm)
- **Kiến trúc**: Client-side only, Single Page Application (SPA)
- **License**: GNU General Public License v3.0

---

## Kiến Trúc Tổng Thể

Dự án được tổ chức thành các module chính:

1. **Visual Programming Module** - Sử dụng Blockly để tạo chương trình bằng cách kéo thả
2. **Code Editor Module** - Sử dụng Ace Editor để viết Python code
3. **3D Simulation Module** - Sử dụng Babylon.js để render và mô phỏng robot
4. **Python Runtime** - Sử dụng Skulpt để chạy Python code trong trình duyệt
5. **Physics Engine** - Sử dụng Ammo.js để mô phỏng vật lý

---

## Công Nghệ & Thư Viện Chi Tiết

### 1. 🎨 **Babylon.js 4.2.1** - 3D Rendering Engine

**Chức năng trong dự án:**
- Render cảnh 3D của robot và môi trường
- Quản lý camera (ArcRotate, Follow, Top, Orthographic)
- Xử lý ánh sáng và bóng đổ (HemisphericLight, DirectionalLight, ShadowGenerator)
- Tích hợp physics engine (Ammo.js) thông qua Babylon Physics
- Load và hiển thị các model 3D (GLB/GLTF format)
- Render loop và tối ưu hóa hiệu năng (SceneOptimizer)

**File sử dụng:**
- `public/babylon/4.2.1/babylon.js` - Core engine
- `public/babylon/4.2.1/babylonjs.loaders.min.js` - Model loaders
- `public/js/babylon.js` - Wrapper và logic tùy chỉnh

**Ví dụ sử dụng:**
```javascript
// Tạo scene với physics
var scene = new BABYLON.Scene(self.engine);
var physicsPlugin = new BABYLON.AmmoJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);

// Camera controls
var cameraArc = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 5, 200, ...);
```

---

### 2. 🔧 **Blockly 12.3.0** - Visual Programming Editor

**Chức năng trong dự án:**
- Cung cấp giao diện kéo-thả để lập trình robot
- Chuyển đổi blocks thành Python code (thông qua generator)
- Quản lý toolbox với các categories (Movement, Sensors, Loops, etc.)
- Hỗ trợ multi-page workspace
- Custom blocks cho robot (motors, sensors, movements)
- Code generation cho Ev3dev2 và Pybricks API

**File sử dụng:**
- `public/blockly-12.3.0/blockly_compressed.js` - Core Blockly
- `public/blockly-12.3.0/blocks_compressed.js` - Default blocks
- `public/blockly-12.3.0/python_compressed.js` - Python generator
- `public/js/blockly.js` - Custom configuration
- `public/js/ev3dev2_generator.js` - Ev3dev2 code generator
- `public/js/pybricks_generator.js` - Pybricks code generator
- `public/toolbox.xml` - Toolbox definition
- `public/customBlocks.json` - Custom block definitions

**Plugins:**
- `field-multilineinput-6.0.2.js` - Multiline input fields
- `workspace-minimap-0.3.2.js` - Minimap cho workspace

**Ví dụ sử dụng:**
```javascript
Blockly.inject('blocklyDiv', {
  toolbox: toolbox,
  theme: 'customTheme',
  zoom: { controls: true }
});
```

---

### 3. 🐍 **Skulpt 0.11.0** - Python Interpreter (Browser)

**Chức năng trong dự án:**
- Chạy Python code trong trình duyệt (client-side)
- Không cần backend server để execute code
- Hỗ trợ Python standard library cơ bản
- Tích hợp với robot simulation để điều khiển robot
- Console output và error handling

**File sử dụng:**
- `public/skulpt/0.11.0/skulpt.min.js` - Python interpreter core
- `public/skulpt/0.11.0/skulpt-stdlib.js` - Standard library
- `public/js/skulpt.js` - Wrapper và robot API integration
- `public/ev3dev2/*.py` - Ev3dev2 API simulation
- `public/pybricks/*.py` - Pybricks API simulation

**Ví dụ sử dụng:**
```javascript
Sk.configure({output: function(text) { console.log(text); }});
Sk.importMainWithBody("<stdin>", false, code);
```

---

### 4. ✏️ **Ace Editor 1.11.2** - Code Editor

**Chức năng trong dự án:**
- Text editor cho Python code với syntax highlighting
- Autocomplete và code suggestions
- Multi-file support (multiple Python modules)
- Code navigation và editing tools
- Custom completer tích hợp với robot API

**File sử dụng:**
- `public/ace-1.11.2/ace.js` - Core editor
- `public/ace-1.11.2/ext-language_tools.js` - Language tools
- `public/js/gearsbot_completer.js` - Custom autocomplete

**Ví dụ sử dụng:**
```javascript
var editor = ace.edit("pythonCode");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
```

---

### 5. ⚡ **Ammo.js** - Physics Engine (WebAssembly)

**Chức năng trong dự án:**
- Mô phỏng vật lý thực tế cho robot và objects
- Collision detection và response
- Gravity, friction, damping
- Rigid body dynamics
- Tích hợp với Babylon.js thông qua AmmoJSPlugin

**File sử dụng:**
- `public/ammo/ammo-20210414.wasm.js` - WASM loader
- `public/ammo/ammo-20210414.wasm.wasm` - Physics engine binary

**Lưu ý:**
- Ammo.js là port của Bullet Physics Engine sang WebAssembly
- Khởi tạo bất đồng bộ (async) trước khi sử dụng Babylon.js

**Ví dụ sử dụng:**
```javascript
Ammo().then(function() {
  var physicsPlugin = new BABYLON.AmmoJSPlugin();
  scene.enablePhysics(gravity, physicsPlugin);
});
```

---

### 6. 📦 **jQuery 3.5.1** - DOM Manipulation

**Chức năng trong dự án:**
- DOM manipulation và event handling
- AJAX requests (nếu cần)
- UI interactions (click, hover, etc.)
- Selector và traversal

**File sử dụng:**
- `public/jquery/jquery-3.5.1.slim.min.js` - Slim version (không có AJAX, effects)

**Ví dụ sử dụng:**
```javascript
$('.menuItem').click(function() { ... });
self.$console = $('.console');
```

---

### 7. 🗜️ **JSZip 3.5.0** - File Compression/Archiving

**Chức năng trong dự án:**
- Tạo và đọc ZIP files
- Export/import projects
- Package Python modules và robot configurations
- Download/upload projects

**File sử dụng:**
- `public/jszip/3.5.0/jszip.min.js`

**Ví dụ sử dụng:**
```javascript
var zip = new JSZip();
zip.file("main.py", pythonCode);
zip.generateAsync({type: "blob"}).then(function(content) { ... });
```

---

### 8. 👆 **Pep.js 0.4.3** - Pointer Events Polyfill

**Chức năng trong dự án:**
- Hỗ trợ pointer events cho touch devices
- Chuẩn hóa mouse và touch interactions
- Tương thích cross-browser

**File sử dụng:**
- `public/pep/0.4.3/pep.min.js`

---

### 9. 🎨 **SCSS/SASS** - CSS Preprocessor

**Chức năng trong dự án:**
- Styling cho ứng dụng
- Variables, mixins, nesting
- Modular CSS structure
- Compile thành CSS trước khi deploy

**File cấu trúc:**
- `scss/main.scss` - Main stylesheet (imports tất cả)
- `scss/widgets.scss` - Widget components
- `scss/_blocklyPanel.scss` - Blockly panel styles
- `scss/_simPanel.scss` - Simulator panel styles
- `scss/_pythonPanel.scss` - Python editor panel styles
- `scss/_arena.scss` - Arena mode styles
- `scss/_configuratorAndBuilder.scss` - Configurator styles
- `scss/_font.scss` - Font definitions

**Output:**
- `public/css/main.css` - Compiled main CSS
- `public/css/widgets.css` - Compiled widgets CSS

---

### 10. 🐍 **Python Build Scripts**

**Chức năng:**
- `updateVersion.py` - Tạo cache-busting version hashes cho assets
- `buildModelsList.py` - Generate danh sách models từ thư mục

**File:**
- `updateVersion.py` - Tìm và cập nhật version hash trong HTML/JS files
- `buildModelsList.py` - Tạo `public/js/builtInModels.js` từ model files

---

## Các Thư Viện Bổ Sung

### Cannon.js 0.6.2 & Oimo.js 1.0.9
- Alternative physics engines (không được sử dụng, chỉ có trong codebase)
- Dự án hiện tại sử dụng Ammo.js

### Blockly Plugins
- **field-multilineinput**: Custom field cho multi-line input
- **workspace-minimap**: Minimap view cho workspace lớn

---

## Cấu Trúc File Chính

```
robot-sim/
├── public/                 # Static files để serve
│   ├── index.html         # Main application entry point
│   ├── js/                # Custom JavaScript modules
│   │   ├── babylon.js     # Babylon.js wrapper
│   │   ├── blockly.js     # Blockly configuration
│   │   ├── skulpt.js      # Skulpt integration
│   │   ├── Robot.js       # Robot class
│   │   ├── Wheel.js       # Wheel component
│   │   └── worlds/        # World definitions
│   ├── css/               # Compiled CSS
│   ├── models/            # 3D models (GLB/GLTF)
│   └── worlds/            # World configurations (JSON)
├── scss/                  # SCSS source files
├── assets/                # SVG icons và textures
└── netlify.toml           # Netlify deployment config
```

---

## Workflow & Data Flow

1. **Programming:**
   - User tạo program bằng Blockly hoặc viết Python code
   - Blockly blocks được convert thành Python qua generator
   - Python code được hiển thị trong Ace Editor

2. **Execution:**
   - User click "Run"
   - Python code được execute bởi Skulpt
   - Skulpt gọi robot API (ev3dev2/pybricks)
   - API calls được translate thành robot actions

3. **Simulation:**
   - Robot actions được render trong Babylon.js
   - Physics được tính toán bởi Ammo.js
   - Visual feedback được cập nhật real-time

---

## Dependencies Summary

| Thư viện | Version | Mục đích |
|----------|---------|----------|
| Babylon.js | 4.2.1 | 3D Rendering |
| Blockly | 12.3.0 | Visual Programming |
| Skulpt | 0.11.0 | Python Runtime |
| Ace Editor | 1.11.2 | Code Editor |
| Ammo.js | 20210414 | Physics Engine |
| jQuery | 3.5.1 | DOM Manipulation |
| JSZip | 3.5.0 | File Compression |
| Pep.js | 0.4.3 | Pointer Events |
| Dart Sass | - | CSS Compilation |

---

## Browser Requirements

- Modern browser với WebAssembly support
- Canvas API support
- WebGL support (cho Babylon.js)
- ES6+ JavaScript support

---

## Build Process

1. **Compile SCSS:**
   ```bash
   sass scss/main.scss:public/css/main.css --no-source-map
   sass scss/widgets.scss:public/css/widgets.css --no-source-map
   ```

2. **Update Version Hashes:**
   ```bash
   python3 updateVersion.py
   ```

3. **Build Models List (tùy chọn):**
   ```bash
   python3 buildModelsList.py
   ```

---

## Deployment

Dự án được thiết kế để deploy như một static website:
- Netlify (configured với `netlify.toml`)
- GitHub Pages
- Bất kỳ static hosting nào khác

**Lưu ý:** Phải serve qua HTTP/HTTPS, không thể chạy từ `file://` URL do CORS restrictions.

---

## Credits

Dự án này được xây dựng dựa trên các open source projects:
- [Babylon.js](https://babylonjs.org)
- [Blockly](https://developers.google.com/blockly)
- [Skulpt](https://skulpt.org)
- [Ace Editor](https://ace.c9.io)
- [Ammo.js](https://github.com/kripken/ammo.js/)
- [Bullet Physics](https://pybullet.org/)

---

*Tài liệu này được tạo để giúp developers hiểu rõ kiến trúc và công nghệ sử dụng trong dự án Gears Robot Simulator.*

