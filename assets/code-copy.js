(() => {
  document.querySelectorAll('.markdown pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code || pre.closest('.jw-code-block')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'jw-code-block';
    pre.before(wrapper);
    wrapper.append(pre);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jw-code-copy';
    const icons = {
      copy: '<rect x="8" y="8" width="11" height="12"/><path d="M15 8V4H4v12h4"/>',
      success: '<path d="m4 12 5 5L20 6"/>',
      error: '<path d="m6 6 12 12M18 6 6 18"/>'
    };
    const setState = (state, label) => {
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[state]}</svg>`;
      button.setAttribute('aria-label', label);
      button.title = label;
    };
    setState('copy', '复制代码');
    const status = document.createElement('span');
    status.className = 'jw-visually-hidden';
    status.setAttribute('role', 'status');
    wrapper.append(button, status);
    let reset;
    button.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(code.textContent);
        setState('success', '代码已复制');
        status.textContent = '代码已复制';
      } catch {
        setState('error', '复制失败，请重试');
        status.textContent = '复制失败，请选择代码后手动复制';
      }
      reset = setTimeout(() => { setState('copy', '复制代码'); status.textContent = ''; }, 2000);
    });
  });
})();
