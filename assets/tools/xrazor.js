(function () {
  'use strict';

  function init() {
    var root = document.querySelector('[data-xrazor]');
    if (!root || typeof XRazor === 'undefined') return;

    var input = root.querySelector('[data-xrazor-input]');
    var output = root.querySelector('[data-xrazor-output]');
    var mode = root.querySelector('[data-xrazor-mode]');
    var file = root.querySelector('[data-xrazor-file]');
    var status = root.querySelector('[data-xrazor-status]');
    var downloadName = 'xrazor-output.txt';

    function setStatus(message, error) {
      status.textContent = message;
      status.classList.toggle('is-error', Boolean(error));
    }

    function detectMode(value) {
      try {
        var parsed = JSON.parse(value);
        return parsed && parsed.log && Array.isArray(parsed.log.entries) ? 'har' : 'html';
      } catch (error) {
        return 'html';
      }
    }

    function clean() {
      var value = input.value;
      if (!value.trim()) {
        output.value = '';
        setStatus('没有可处理的内容', true);
        return;
      }

      var selectedMode = mode.value === 'auto' ? detectMode(value) : mode.value;
      try {
        var result = selectedMode === 'har' ? XRazor.cleanHarText(value) : XRazor.cleanHtmlText(value);
        output.value = result.content;
        downloadName = selectedMode === 'har' ? 'xrazor-output.har.json' : 'xrazor-output.html';
        setStatus('已处理为 ' + selectedMode.toUpperCase());
      } catch (error) {
        output.value = '';
        setStatus(error.message || '处理失败', true);
      }
    }

    function copyOutput() {
      if (!output.value) return setStatus('没有可复制的输出', true);
      if (!navigator.clipboard) return setStatus('当前浏览器不支持复制', true);
      navigator.clipboard.writeText(output.value).then(function () {
        setStatus('输出已复制');
      }, function () {
        setStatus('复制失败', true);
      });
    }

    function downloadOutput() {
      if (!output.value) return setStatus('没有可下载的输出', true);
      var blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = downloadName;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus('输出已下载');
    }

    file.addEventListener('change', function () {
      var selected = file.files && file.files[0];
      if (!selected) return;
      selected.text().then(function (value) {
        input.value = value;
        if (selected.name.toLowerCase().endsWith('.har')) mode.value = 'har';
        else if (selected.name.toLowerCase().endsWith('.html') || selected.name.toLowerCase().endsWith('.htm')) mode.value = 'html';
        setStatus('已载入 ' + selected.name);
      });
    });
    root.querySelector('[data-xrazor-clean]').addEventListener('click', clean);
    root.querySelector('[data-xrazor-clear]').addEventListener('click', function () {
      input.value = '';
      output.value = '';
      file.value = '';
      setStatus('等待输入');
    });
    root.querySelector('[data-xrazor-copy]').addEventListener('click', copyOutput);
    root.querySelector('[data-xrazor-download]').addEventListener('click', downloadOutput);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
