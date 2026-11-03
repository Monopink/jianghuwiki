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
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');
    const status = document.createElement('span');
    status.className = 'jw-visually-hidden';
    status.setAttribute('role', 'status');
    wrapper.append(button, status);
    let reset;
    button.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = '已复制';
        status.textContent = '代码已复制';
      } catch {
        button.textContent = '复制失败';
        status.textContent = '复制失败，请选择代码后手动复制';
      }
      reset = setTimeout(() => { button.textContent = '复制'; status.textContent = ''; }, 2000);
    });
  });
})();
