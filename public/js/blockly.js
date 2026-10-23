var blockly = new function() {
  var self = this;

  self.theme = Blockly.Theme.defineTheme('scratchZelosTheme', {
    'base': Blockly.Themes.Zelos,
    'startHats': true,
    'fontStyle': {
      'family': '"Plus Jakarta Sans", "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
      'weight': '700',
      'size': 11
    },
    'blockStyles': {
      'hat_blocks': {
        'colourPrimary': '#FFBF00',
        'colourSecondary': '#E6AC00',
        'colourTertiary': '#CC9900',
        'hat': 'cap'
      },
      'motion_blocks': {
        'colourPrimary': '#4C97FF',
        'colourSecondary': '#4280D7',
        'colourTertiary': '#3373CC'
      },
      'motor_blocks': {
        'colourPrimary': '#2F6BFF',
        'colourSecondary': '#2558D9',
        'colourTertiary': '#1D46B5'
      },
      'sensor_blocks': {
        'colourPrimary': '#10B981',
        'colourSecondary': '#059669',
        'colourTertiary': '#047857'
      },
      'sound_blocks': {
        'colourPrimary': '#CF63CF',
        'colourSecondary': '#C94FC9',
        'colourTertiary': '#BD42BD'
      },
      'pen_blocks': {
        'colourPrimary': '#0FBD8C',
        'colourSecondary': '#0DA57A',
        'colourTertiary': '#0B8E69'
      },
      'experimental_blocks': {
        'colourPrimary': '#EC4899',
        'colourSecondary': '#DB2777',
        'colourTertiary': '#BE185D'
      },
      'control_blocks': {
        'colourPrimary': '#FFAB19',
        'colourSecondary': '#EC9C13',
        'colourTertiary': '#CF8B17'
      },
      'comment_blocks': {
        'colourPrimary': '#64748B',
        'colourSecondary': '#475569',
        'colourTertiary': '#334155'
      },
      'logic_blocks': {
        'colourPrimary': '#8B5CF6',
        'colourSecondary': '#7C3AED',
        'colourTertiary': '#6D28D9'
      },
      'loop_blocks': {
        'colourPrimary': '#F97316',
        'colourSecondary': '#EA580C',
        'colourTertiary': '#C2410C'
      },
      'math_blocks': {
        'colourPrimary': '#59C059',
        'colourSecondary': '#46B946',
        'colourTertiary': '#389438'
      },
      'text_blocks': {
        'colourPrimary': '#14B8A6',
        'colourSecondary': '#0D9488',
        'colourTertiary': '#0F766E'
      },
      'list_blocks': {
        'colourPrimary': '#0EA5E9',
        'colourSecondary': '#0284C7',
        'colourTertiary': '#0369A1'
      },
      'variable_blocks': {
        'colourPrimary': '#FF8C1A',
        'colourSecondary': '#FF8000',
        'colourTertiary': '#DB6E00'
      },
      'variable_dynamic_blocks': {
        'colourPrimary': '#FF8C1A',
        'colourSecondary': '#FF8000',
        'colourTertiary': '#DB6E00'
      },
      'procedure_blocks': {
        'colourPrimary': '#FF6680',
        'colourSecondary': '#FF4D6A',
        'colourTertiary': '#FF3355'
      }
    },
    'componentStyles': {
      'workspaceBackgroundColour': '#F8FAFC',
      'toolboxBackgroundColour': '#F8FAFC',
      'toolboxForegroundColour': '#1E293B',
      'flyoutBackgroundColour': '#F1F5F9',
      'flyoutForegroundColour': '#334155',
      'flyoutOpacity': 0.97,
      'scrollbarColour': '#CBD5E1',
      'scrollbarOpacity': 0.75
    }
  });

  var options = {
    toolbox : null,
    renderer : 'zelos',
    grid: {
      spacing: 24,
      length: 2,
      colour: '#CBD5E1',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.82,
      maxScale: 2.5,
      minScale: 0.4,
      scaleSpeed: 1.15
    },
    move: {
      scrollbars: true,
      drag: true,
      wheel: true
    },
    collapse : true,
    comments : true,
    disable : true,
    maxBlocks : Infinity,
    trashcan : false,
    horizontalLayout : false,
    toolboxPosition : 'start',
    css : true,
    media: 'blockly-9.0.0/media',
    rtl : RTL,
    scrollbars : true,
    sounds : true,
    oneBasedIndex : false,
    theme: self.theme
  };

  this.unsaved = false;
  this.generator = ev3dev2_generator;

  this.mirror = true;

  // Run on page load
  this.init = function() {
    if (Blockly.zelos && Blockly.zelos.Renderer) {
      Blockly.zelos.Renderer.prototype.makeConstants_ = function() {
        var constants = new Blockly.zelos.ConstantProvider();
        constants.ADD_START_HATS = true;
        return constants;
      };
    }
    if (Blockly.geras && Blockly.geras.Renderer) {
      Blockly.geras.Renderer.prototype.makeConstants_ = function() {
        var constants = new Blockly.geras.ConstantProvider();
        constants.ADD_START_HATS = true;
        return constants;
      };
    }

    const script = document.createElement('script');
    script.src = 'blockly-9.0.0/msg/js/' + LANG + '.js';
    script.addEventListener('load', function() {
      self.loadCustomBlocks()
        .then(self.loadToolBox)
        .then(self.generator.load());
    });
    document.head.appendChild(script);
  };

  // Load toolbox
  this.loadToolBox = function() {
    return fetch('toolbox.xml?v=20261022e')
      .then(response => response.text())
      .then(function(response) {
        response = i18n.replace(response);
        self.toolboxXml = (new DOMParser()).parseFromString(response, "text/xml");
        options.toolbox = self.toolboxXml.getElementById('toolbox');
        self.displayedWorkspace = Blockly.inject('blocklyDiv', options);

        // Strip search from toolbox as it cannot be loaded twice
        for (let i=0; i<options.toolbox.childNodes.length; i++) {
          if (options.toolbox.childNodes[i].tagName == 'search') {
            options.toolbox.removeChild(options.toolbox.childNodes[i]);
            break;
          }
        }

        self.workspace = Blockly.inject('blocklyHiddenDiv', options);
        // self.minimap = new Minimap(self.displayedWorkspace);
        // self.minimap.init();
        self.displayedWorkspace.addChangeListener(self.mirrorEvent);
        self.registerCustomToolboxes();

        self.loadDefaultWorkspace();

        self.workspace.addChangeListener(Blockly.Events.disableOrphans);
        self.displayedWorkspace.addChangeListener(Blockly.Events.disableOrphans);
        // self.loadLocalStorage();
        setTimeout(self.loadLocalStorage, 200);
        setTimeout(function(){
          self.workspace.addChangeListener(self.checkModified);
        }, 1000);
      });
  };

  // Filter blocks from toolbox. Load from URL.
  this.loadToolboxFilterURL = function(url) {
    return fetch(url)
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          toastMsg(i18n.get('#sim-not_found#'));
          return Promise.reject(new Error('invalid_blocks_filter'));
        }
      })
      .then(function(response) {
        self.loadToolboxFilter(JSON.parse(response));
      });
  };

  // Filter blocks from toolbox
  this.loadToolboxFilter = function(filter) {
    if (typeof self.displayedWorkspace == 'undefined') {
      setTimeout(function(){ self.loadToolboxFilter(filter); }, 500);
      return;
    }

    let filteredXml = self.toolboxXml.cloneNode(true);

    let removedCategories = [];
    let showCategories = [];
    let removedBlocks = [];

    if (typeof filter.deny != 'undefined') {
      if (typeof filter.deny.categories != 'undefined') {
        for (let deny of filter.deny.categories) {
          let toHide = filteredXml.querySelector('[id="' + deny + '"]');
          if (toHide) {
            removedCategories.push(toHide);
            for (let i=0; i<toHide.children.length; i++) {
              if (toHide.children[i].tagName == 'block') {
                removedBlocks.push(toHide.children[i]);
              }
            }
          }
        }
      }
      if (typeof filter.deny.blocks != 'undefined') {
        for (let deny of filter.deny.blocks) {
          let toHide = filteredXml.querySelector('[type="' + deny + '"]');
          if (toHide) {
            removedBlocks.push(toHide);
          }
        }
      }
    }

    if (typeof filter.show != 'undefined') {
      if (typeof filter.show.categories != 'undefined') {
        for (let show of filter.show.categories) {
          let toShow = filteredXml.querySelector('[id="' + show + '"]');
          if (toShow) {
            removedCategories = removedCategories.filter(function(item) {
              return item != toShow;
            });
            showCategories.push(toShow);
          }
        }
      }
      if (typeof filter.show.blocks != 'undefined') {
        for (let show of filter.show.blocks) {
          let toShow = filteredXml.querySelectorAll('[type="' + show + '"]');
          if (toShow.length > 0) {
            for (let i=0; i<toShow.length; i++) {
              if (toShow[i].tagName == 'block') {
                let parent = toShow[i].parentNode;
                removedCategories = removedCategories.filter(function(item) {
                  return item != parent;
                });
                removedBlocks = removedBlocks.filter(function(item) {
                  return item != toShow[i];
                });
              }
            }
          }
        }
      }
    }

    for (let category of removedCategories) {
      category.setAttribute('hidden', true);
    }
    for (let category of showCategories) {
      category.setAttribute('hidden', false);
    }
    for (let block of removedBlocks) {
      block.remove();
    }

    self.displayedWorkspace.updateToolbox(filteredXml.getElementById('toolbox'));
  };

  // Register variables and procedures toolboxes callbacks
  this.registerCustomToolboxes = function() {
    self.displayedWorkspace.registerToolboxCategoryCallback('VARIABLE2', function(workspace) {
      var xmlList = [];
      var button = document.createElement('button');
      button.setAttribute('text', '%{BKY_NEW_VARIABLE}');
      button.setAttribute('callbackKey', 'CREATE_VARIABLE');

      workspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
        setTimeout(function(){
          self.displayedWorkspace.toolbox.refreshSelection()
        }, 100);
      });

      xmlList.push(button);

      var blockList = Blockly.Variables.flyoutCategoryBlocks(self.workspace);
      xmlList = xmlList.concat(blockList);
      return xmlList;
    });

    self.displayedWorkspace.registerToolboxCategoryCallback('PROCEDURE2', function(workspace){
      let blocks = self.workspace.getToolboxCategoryCallback('PROCEDURE')(self.workspace);
      for (let block of blocks) {
        if (block.type == 'procedures_callnoreturn' || block.type == 'procedures_callreturn') {
          block.inline = true;
          block.inputs = {};
          for (let i=0; i<block.extraState.params.length; i++) {
            block.inputs['ARG' + i] = {
              'shadow': {
                'type': 'math_number',
                'fields': {
                  'NUM': 0
                }
              }
            }
          }
        }
      }
      return blocks;
    });
  };

  // mirror from displayed to actual (hidden) workspace
  this.mirrorEvent = function(primaryEvent) {
    if (self.mirror == false) {
      return;
    }
    if (primaryEvent.isUiEvent) {
      return;
    }
    if (
      primaryEvent.type == Blockly.Events.BLOCK_CREATE
      && primaryEvent.xml.tagName == 'shadow'
    ) {
      let id1 = primaryEvent.blockId;
      let parentId = self.displayedWorkspace.getBlockById(id1).parentBlock_.id;
      let blockIds = [];
      self.displayedWorkspace.getAllBlocks().forEach(function(block){
        blockIds.push(block.id);
      });

      let block2 = null;
      self.workspace.getAllBlocks().forEach(function(block){
        if (
          block.isShadow_
          && block.parentBlock_.id == parentId
          && blockIds.indexOf(block.id) == -1
        ) {
          block2 = block;
        }
      });

      if (block2 != null) {
        let id2 = block2.id;

        block2.id = id1;
        self.workspace.blockDB_[id1] = self.workspace.blockDB_[id2];
        delete self.workspace.blockDB_[id2];

        return;
      }
    }
    if (typeof primaryEvent.varType != 'undefined') {
      primaryEvent.varType = ' ';
    }
    var json = primaryEvent.toJson();
    json.varType = '';
    var secondaryEvent = Blockly.Events.fromJson(json, self.workspace);
    try {
      secondaryEvent.run(true);
    } catch (err) {
      console.log(err);
    }

    if (primaryEvent.type == Blockly.Events.BLOCK_CREATE) {
      self.assignOrphenToPage(blocklyPanel.currentPage);
    }
    if (primaryEvent.type == Blockly.Events.VAR_DELETE) {
      self.displayedWorkspace.getToolbox().refreshSelection()
    }
  };

  // Load default workspace
  this.loadDefaultWorkspace = function() {
    let xmlText =
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
        '<block type="when_started" id="Q!^ZqS4/(a/0XL$cIi-~" x="63" y="38" deletable="false"><data>Main</data></block>' +
      '</xml>';
    self.loadXmlText(xmlText);
  };

  // Load custom blocks
  this.loadCustomBlocks = function() {
    var blockStyleMap = {
      'when_started': 'hat_blocks',
      'move_tank': 'motion_blocks',
      'move_tank_for': 'motion_blocks',
      'move_steering': 'motion_blocks',
      'move_steering_for': 'motion_blocks',
      'stop': 'motion_blocks',
      'set_movement_motors': 'motion_blocks',
      'tw_fwd': 'motion_blocks',
      'tw_rev': 'motion_blocks',
      'tw_left': 'motion_blocks',
      'tw_right': 'motion_blocks',
      'run_motor': 'motor_blocks',
      'run_motor_for': 'motor_blocks',
      'run_motor_to': 'motor_blocks',
      'stop_motor': 'motor_blocks',
      'speed': 'motor_blocks',
      'position': 'motor_blocks',
      'reset_motor': 'motor_blocks',
      'color_sensor': 'sensor_blocks',
      'color': 'sensor_blocks',
      'tw_color': 'sensor_blocks',
      'ultrasonic_sensor': 'sensor_blocks',
      'laser_sensor': 'sensor_blocks',
      'lidar_sensor': 'sensor_blocks',
      'gyro_sensor': 'sensor_blocks',
      'reset_gyro': 'sensor_blocks',
      'gps_sensor': 'sensor_blocks',
      'touch_state': 'sensor_blocks',
      'wait_for_state': 'sensor_blocks',
      'button_state': 'sensor_blocks',
      'wait_until_button': 'sensor_blocks',
      'camera_capture_image': 'sensor_blocks',
      'camera_get_rgb': 'sensor_blocks',
      'camera_get_hsv': 'sensor_blocks',
      'camera_find_blobs': 'sensor_blocks',
      'object_tracker': 'sensor_blocks',
      'say': 'sound_blocks',
      'beep': 'sound_blocks',
      'play_tone': 'sound_blocks',
      'penDown': 'pen_blocks',
      'penUp': 'pen_blocks',
      'penSetColor': 'pen_blocks',
      'penSetWidth': 'pen_blocks',
      'radio_send': 'experimental_blocks',
      'radio_available': 'experimental_blocks',
      'radio_read': 'experimental_blocks',
      'radio_read_content': 'experimental_blocks',
      'radio_empty': 'experimental_blocks',
      'plotter_init': 'experimental_blocks',
      'plotter_showHide': 'experimental_blocks',
      'plotter_clear': 'experimental_blocks',
      'plotter_drawGrid': 'experimental_blocks',
      'plotter_setColor': 'experimental_blocks',
      'plotter_setPointSize': 'experimental_blocks',
      'plotter_drawPoint': 'experimental_blocks',
      'plotter_drawLine': 'experimental_blocks',
      'plotter_drawTriangle': 'experimental_blocks',
      'sleep': 'control_blocks',
      'wait_until': 'control_blocks',
      'time': 'control_blocks',
      'exit': 'control_blocks',
      'comment': 'comment_blocks'
    };

    return fetch('customBlocks.json?v=20261022e')
      .then(response => response.text())
      .then(function(response) {
        let json = JSON.parse(i18n.replace(response));
        for (let i = 0; i < json.length; i++) {
          let blk = json[i];
          blk.inputsInline = true;
          if (blockStyleMap[blk.type]) {
            blk.style = blockStyleMap[blk.type];
            delete blk.colour;
          } else if (blk.colour === 230) {
            blk.style = 'motion_blocks';
            delete blk.colour;
          } else if (blk.colour === 160) {
            blk.style = 'sensor_blocks';
            delete blk.colour;
          } else if (blk.colour === 65) {
            blk.style = 'control_blocks';
            delete blk.colour;
          } else if (blk.colour === 20) {
            blk.style = 'sound_blocks';
            delete blk.colour;
          } else if (blk.colour === 330) {
            blk.style = 'experimental_blocks';
            delete blk.colour;
          }
        }
        Blockly.defineBlocksWithJsonArray(json);
      });
  };

  // Mark workspace as unsaved
  this.checkModified = function(e) {
    if (e.type != Blockly.Events.UI) {
      self.unsaved = true;
      blocklyPanel.showSave();
    }
  };

  // get xmlText
  this.getXmlText = function() {
    var xml = Blockly.Xml.workspaceToDom(self.workspace);
    return Blockly.Xml.domToText(xml);
  };

  // Save to local storage
  this.saveLocalStorage = function() {
    if (self.workspace && self.unsaved) {
      self.unsaved = false;
      blocklyPanel.hideSave();
      localStorage.setItem('blocklyXML', self.getXmlText());
    }
  };

  // load xmlText to workspace
  this.loadXmlText = function(xmlText) {
    let oldXmlText = self.getXmlText();
    if (xmlText) {
      let dom;
      try {
        dom = Blockly.utils.xml.textToDom(xmlText);
      } catch (err) {
        console.log(err);
        toastMsg('File does not appear to be a valid XML');
        return;
      }

      // Attempt to cleanup Dom
      let whenStartedLoaded = false;
      for (let i=0; i<dom.childNodes.length; i++) {
        if (dom.childNodes[i].tagName == 'shadow') {
          dom.removeChild(dom.childNodes[i]);
          i--;
        }
        try {
          if (dom.childNodes[i].getAttribute('type') == 'when_started') {
            if (whenStartedLoaded) {
              dom.removeChild(dom.childNodes[i]);
              i--;
            }
            whenStartedLoaded = true;
          }
        } catch (err) {
          // Ignore
        }
      }

      self.workspace.clear();

      try {
        Blockly.Xml.domToWorkspace(dom, self.workspace);
      } catch (err) {
        console.log(err);
        toastMsg('Error loading blocks');
        self.loadXmlText(oldXmlText);
      }

      self.assignOrphenToPage('Main');
      self.showPage('Main');

      let pages = [];
      self.workspace.getAllBlocks().forEach(function(block){
        if (pages.indexOf(block.data) == -1) {
          pages.push(block.data);
        }
      });
      blocklyPanel.loadPagesOptions(pages);
    }
  };

  // import functions from xmlText to workspace
  this.importXmlTextFunctions = function(xmlText) {
    if (xmlText) {
      try {
        let procs = [];
        let dom = Blockly.utils.xml.textToDom(xmlText);

        // Save all functions
        dom.querySelectorAll('[type="procedures_defnoreturn"]').forEach(function(block){
          procs.push(block);
        });
        dom.querySelectorAll('[type="procedures_defreturn"]').forEach(function(block){
          procs.push(block);
        });

        // Empty dom
        dom = Blockly.utils.xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"></xml>');
        procs.forEach(function(block){
          dom.append(block);
        });

        Blockly.Xml.domToWorkspace(dom, self.workspace);
        self.assignOrphenToPage('Main');

        let pages = [];
        self.workspace.getAllBlocks().forEach(function(block){
          if (pages.indexOf(block.data) == -1) {
            pages.push(block.data);
          }
        });
        blocklyPanel.loadPagesOptions(pages);

        self.showPage('Main');
      }
      catch (err) {
        console.log(err);
        toastMsg('Invalid Blocks');
      }
    }
  };

  // Load from local storage
  this.loadLocalStorage = function() {
    self.loadXmlText(localStorage.getItem('blocklyXML'));
  };

  // Clear all blocks from displayed workspace
  this.clearDisplayedWorkspace = function() {
    self.mirror = false;
    self.displayedWorkspace.clear();
    setTimeout(function() {
      self.mirror = true;
    }, 200);
  };

  // Delete all blocks in page
  this.deleteAllInPage = function(page) {
    let blocks = self.workspace.getAllBlocks();
    blocks.forEach(function(block){
      if (block.data == page) {
        block.data = '';
        block.dispose();
      }
    });
    self.unsaved = true;
    blocklyPanel.showSave();
  };

  // Copy blocks of specified page into displayed workspace
  this.showPage = function(page) {
    self.mirror = false;
    self.displayedWorkspace.clear();

    let xy = null;
    self.workspace.getAllBlocks().forEach(function(block){
      if (block.parentBlock_ == null && block.data == page) {
        let dom = Blockly.Xml.blockToDomWithXY(block);
        xy = block.getRelativeToSurfaceXY();
        let displayedBlock = Blockly.Xml.domToBlock(dom, self.displayedWorkspace);
        displayedBlock.moveBy(xy.x, xy.y);
      }
    });
    self.workspace.getAllBlocks().forEach(function(block){
      if (
        block.data != page
        && (block.type == 'procedures_defnoreturn' || block.type == 'procedures_defreturn')
      ) {
        let dom = Blockly.Xml.blockToDom(block);
        let displayedBlock = Blockly.Xml.domToBlock(dom, self.displayedWorkspace);
        if (xy) {
          displayedBlock.moveBy(xy.x, xy.y);
        }
        displayedBlock.setMovable(false);
        displayedBlock.setCollapsed(true);
        displayedBlock.setDeletable(false);
        displayedBlock.getDescendants().forEach(function(desc){
          desc.setDeletable(false);
        });
        displayedBlock.svgGroup_.style.display = 'none';
      }
    });
    self.displayedWorkspace.scrollCenter();
    setTimeout(function() {
      self.mirror = true;
    }, 200);
  };

  // Assign orphen blocks to current page
  this.assignOrphenToPage = function(page) {
    let blocks = self.workspace.getAllBlocks();
    blocks.forEach(function(block){
      if (typeof block.data == 'undefined' || ! block.data) {
        block.data = page;
      }
    });
  };

  // Change page name
  this.changePageName = function(from, to) {
    self.assignOrphenToPage(from);
    let blocks = self.workspace.getAllBlocks();
    blocks.forEach(function(block){
      if (block.data == from) {
        block.data = to;
      }
    });
    self.unsaved = true;
    blocklyPanel.showSave();
  };

  // Copy page
  this.copyPage = function(from, to) {
    let blocks = self.workspace.getAllBlocks();
    blocks.forEach(function(block){
      if (block.parentBlock_ == null && block.data == from && block.type != 'when_started') {
        let dom = Blockly.Xml.blockToDom(block);
        let newBlock = Blockly.Xml.domToBlock(dom, self.workspace);
        newBlock.data = to;
        newBlock.getDescendants().forEach(function(desc){
          desc.data = to;
        })
        let xy = block.getRelativeToSurfaceXY();
        newBlock.moveBy(xy.x, xy.y);
      }
    });
    self.unsaved = true;
    blocklyPanel.showSave();
  };

  // Move blocks
  this.moveSelected = function(selected, to) {
    function moveBlock(block, to) {
      block.data = to;
      block.getChildren().forEach(function(desc) {
        moveBlock(desc, to);
      });
    }

    moveBlock(self.workspace.getBlockById(selected.id), to);
  };
}

