(() => {
  const dock = document.querySelector('.contact-dock');
  if (!dock) return;
  const trigger = dock.querySelector('.contact-wechat');
  const panel = dock.querySelector('.contact-panel');
  const close = dock.querySelector('.contact-close');
  const setOpen = (open, restoreFocus = false) => {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) close.focus();
    else if (restoreFocus) trigger.focus();
  };
  trigger.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!panel.hidden && !dock.contains(event.target)) setOpen(false);
  });
})();
