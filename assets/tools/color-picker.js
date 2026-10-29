(function () {
  'use strict';

  function init() {
    if (typeof AColorPicker === 'undefined') return;
    var logos = document.querySelectorAll('.color-picker-page .filled-logo');
    AColorPicker.from('.color-picker-page .picker').on('change', function (picker, color) {
      logos.forEach(function (logo) { logo.style.fill = color; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
