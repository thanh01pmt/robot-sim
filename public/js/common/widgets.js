// Read query string
function readGET(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else {
    return decodeURI(results[1]);
  }
}

// Set on click animation
function setOnClickAnimation($buttons) {
  $buttons.forEach(function($button){
    if (typeof $button[0] != 'undefined') {
      $button[0].addEventListener('pointerdown', function() { $button.addClass('animateClick')});
      $button[0].addEventListener('pointerup', function() { $button.removeClass('animateClick')});
      $button[0].addEventListener('pointerout', function() { $button.removeClass('animateClick')});
    }
  });
}

// File menu dropdown
function menuDropDown($menuBtn, menuItems, options) {
  options = options || {};
  var $dropDown = $(
    '<ul class="menuDropDown ' + (options.className || '') + '"></ul>'
  );

  menuItems.forEach(function(menuItem) {
    let $li = $('<li></li>');
    $li.html(menuItem.html);
    if (menuItem.line) {
      $li.addClass('underline');
    }
    $li.click(function() { menuItem.callback($li); });
    $dropDown.append($li);
  });

  // Ensure $menuBtn is positioned so absolute child aligns to it
  if ($menuBtn.css('position') === 'static') {
    $menuBtn.css('position', 'relative');
  }

  $dropDown.css({
    position: 'absolute',
    top: 'calc(100% + 4px)',
    zIndex: 9999
  });

  if (options.align === 'right') {
    $dropDown.css({ left: 'auto', right: '0' });
  } else {
    $dropDown.css({ left: '0', right: 'auto' });
  }

  $(document).one('click', function(e){
    $('.menuDropDown').remove();
  });

  $menuBtn.append($dropDown);

  // Prevent overflowing right boundary of viewport
  try {
    var rect = $dropDown[0].getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      $dropDown.css({ left: 'auto', right: '0' });
    }
  } catch (err) {}

  return $menuBtn;
}

// Adds the "pressed" class on touch, and remove when released
function setOnTouch(el) {
  if (el.constructor === Array) {
    el.forEach(function($element) {
      $element.on('touchstart', function() { $(this).addClass('pressed'); });
      $element.on('touchend', function() { $(this).removeClass('pressed'); });
    });
  } else {
    el.on('touchstart', function() { $(this).addClass('pressed'); });
    el.on('touchend', function() { $(this).removeClass('pressed'); });
  }
}

// Pop an error message around an element
function popErrorMsg(element, message, pos) {
  pos = (typeof pos !== 'undefined') ?  pos : 'top';

  $(element).popover({
    content: message,
    placement: pos
  });
  $(element).popover('show');
  setTimeout(function() {
    $(element).popover('hide'); }
    , 1000
  );
  setTimeout(function() {
    $(element).popover('destroy'); }
    , 1500
  );
}

// Toast message right at the top
function toastMsg(message) {
  var $toast = $('<div class="toastMsg">' + message + '</div>');
  $toast.on('animationend', function() { $toast.remove(); });
  $('html > body').append($toast);
}

// Show activity spinner
function showSpinner() {
  if (typeof $('#activitySpinner')[0] === 'undefined') {
    var spinner = '<div id="activitySpinner"><i class="fas fa-sync fa-spin"></i></div>';

    $('html > body').append(spinner);
  }
}

// Hide activity spinner
function hideSpinner() {
  if (typeof $('#activitySpinner')[0] !== 'undefined') {
    $('#activitySpinner').remove();
  }
}

// Hides most text and add a "more..." to an element
function moreText($element, length) {
  if (typeof length == 'undefined') {
    length = 60;
  }
  if (length >= $element.text().length) {
    return;
  }

  var fullText = $element.text().trim();
  var shortText = fullText.substr(0,length) + '... ';

  $element[0].fullText = fullText;
  $element.html(shortText);

  var more = $('<span class="moreText">more&gt;</span>');
  more.click(function() {
    var fullText = $(this).parent()[0].fullText;

    $(this).parent().html(fullText);
  });

  $element.append(more);
}

// Generic dialog window
function dialog(title, $bodyContent, $buttons, className='') {
  var $dialog = $('<div class="dialogScreen '+ className + '"></div>');
  var $box = $(
    '<div class="dialogWindow">' +
      '<div class="dialogTitle">' +
        '<span class="dialogTitleText">' + title + '</span>' +
        '<button type="button" class="dialogCloseBtn" title="Close">&times;</button>' +
      '</div>' +
    '</div>'
  );
  var $body = $('<div class="dialogBody"></div>');
  var $buttonsRow = $('<div class="dialogButtonsRow">');

  $body.append($bodyContent);
  $box.append($body);
  $buttonsRow.append($buttons);
  $box.append($buttonsRow);
  $dialog.append($box);

  $dialog.$body = $body;
  $dialog.$buttonsRow = $buttonsRow;

  $buttons = $buttonsRow.children();

  $dialog.close = function(callback) {
    $box.on('animationend', function() {
      if (typeof callback != 'undefined') {
        callback($dialog);
      }
      $dialog.remove();
    });
    $box.addClass('animatedHide');
  };

  $box.find('.dialogCloseBtn').on('click', function() {
    $dialog.close();
  });

  $dialog.on('click', function(e) {
    if (e.target === $dialog[0]) {
      $dialog.close();
    }
  });

  $('html > body').append($dialog);

  return $dialog;
}

// Confirmation dialog
function confirmDialog(options, callback) {
  if (typeof options == 'string') {
    options = { message: options };
  }

  if (typeof options.title == 'undefined') {
    options.title = 'Confirm?';
  }
  if (typeof options.cancel == 'undefined') {
    options.cancel = 'Cancel';
  }
  if (typeof options.confirm == 'undefined') {
    options.confirm = 'Ok';
  }

  var bodyContent = options.message;
  var $buttons = $(
    '<button type="button" class="cancel btn btn-light">' + options.cancel + '</button>' +
    '<button type="button" class="confirm btn btn-success">' + options.confirm + '</button>'
  );

  var $dialog = dialog(options.title, bodyContent, $buttons);

  $buttons.siblings('.cancel').click(function() { $dialog.close(); if (typeof options.onCancel === 'function') options.onCancel(); });
  $buttons.siblings('.confirm').click(function() { $dialog.close(); if (typeof callback === 'function') callback(); });

  return $dialog;
}

// Modern Prompt Dialog (replaces window.prompt across Blockly & Pages)
function promptDialog(options, callback) {
  if (typeof options == 'string') {
    options = { message: options };
  }
  var title = options.title || (typeof LANG !== 'undefined' && LANG === 'vi' ? 'Nhập thông tin' : 'Input');
  var message = options.message || '';
  var defaultValue = typeof options.defaultValue !== 'undefined' ? options.defaultValue : '';
  var cancelLabel = options.cancel || (typeof LANG !== 'undefined' && LANG === 'vi' ? 'Hủy' : 'Cancel');
  var confirmLabel = options.confirm || 'OK';

  var $body = $(
    '<div class="promptDialogContent">' +
      (message ? '<div style="margin-bottom:8px; font-weight:600; color:#334155;"></div>' : '') +
      '<input type="text" class="promptDialogInput" style="width:100%;" />' +
    '</div>'
  );
  if (message) {
    $body.find('div').first().text(message);
  }
  var $input = $body.find('.promptDialogInput');
  $input.val(defaultValue);

  var $buttons = $(
    '<button type="button" class="cancel btn btn-light">' + cancelLabel + '</button>' +
    '<button type="button" class="confirm btn btn-success">' + confirmLabel + '</button>'
  );

  var $dialog = dialog(title, $body, $buttons);

  function submit() {
    var val = $input.val();
    $dialog.close();
    if (typeof callback === 'function') callback(val);
  }

  function cancel() {
    $dialog.close();
    if (typeof callback === 'function') callback(null);
  }

  $buttons.siblings('.cancel').on('click', cancel);
  $buttons.siblings('.confirm').on('click', submit);
  $input.on('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });

  setTimeout(function() {
    $input.trigger('focus');
    if ($input[0] && typeof $input[0].select === 'function') {
      $input[0].select();
    }
  }, 50);

  return $dialog;
}

// Acknowledge dialog (single button)
function acknowledgeDialog(options, callback) {
  if (typeof options == 'string') {
    options = { message: options };
  }

  if (typeof options.title == 'undefined') {
    options.title = 'Completed';
  }
  if (typeof options.ok == 'undefined') {
    options.ok = 'OK';
  }

  var bodyContent = options.message;
  var $button = $(
    '<button type="button" class="ok btn btn-success">' + options.ok + '</button>'
  );

  var $dialog = dialog(options.title, bodyContent, $button, options.className);

  $button.click(function() { $dialog.close(callback); });

  return $dialog;
}

// Error modal. Only close when clicked.
function showErrorModal(errors) {
  var errorsDiv = '';
  if (errors.constructor === Array) {
    errors.forEach(function(error) { errorsDiv += '<div class="errorBody">' + error + '</div>'; });
  } else {
    errorsDiv = errors;
  }

  var options = {
    title: 'Error',
    message: errorsDiv,
  }

  acknowledgeDialog(options);
}

// Automatically wire Blockly's internal prompt/confirm/alert dialogs to our modern UI modals
window.addEventListener('DOMContentLoaded', function() {
  if (typeof Blockly !== 'undefined' && Blockly.dialog) {
    if (typeof Blockly.dialog.setPrompt === 'function') {
      Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
        promptDialog({ message: message, defaultValue: defaultValue }, callback);
      });
    }
    if (typeof Blockly.dialog.setAlert === 'function') {
      Blockly.dialog.setAlert(function(message, callback) {
        acknowledgeDialog({ title: 'Notice', message: message }, callback);
      });
    }
    if (typeof Blockly.dialog.setConfirm === 'function') {
      Blockly.dialog.setConfirm(function(message, callback) {
        confirmDialog({
          title: 'Confirm',
          message: message,
          onCancel: function() { if (callback) callback(false); }
        }, function() {
          if (callback) callback(true);
        });
      });
    }
  }
});