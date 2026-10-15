(() => {
  const sidebar = document.querySelector('.article-toc');
  const content = document.querySelector('.article-content');
  if (!sidebar || !content) return;
  const headings = [...content.querySelectorAll('h2,h3,h4,h5,h6')].filter(h => h.textContent.trim());
  if (!headings.length) return;
  const list = sidebar.querySelector('ol');
  const used = new Set([...document.querySelectorAll('[id]')].map(el => el.id));
  const minLevel = Math.min(...headings.map(h => Number(h.tagName[1])));
  const links = headings.map((heading, i) => {
    if (!heading.id) {
      let id = `section-${i + 1}`;
      while (used.has(id)) id += '-section';
      heading.id = id;
      used.add(id);
    }
    const item = document.createElement('li');
    item.style.setProperty('--toc-depth', Number(heading.tagName[1]) - minLevel);
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    list.append(item);
    return link;
  });
  sidebar.hidden = false;
  document.querySelector('.article-shell').classList.add('has-toc');
  const desktop = matchMedia('(min-width: 1100px)');
  const details = sidebar.querySelector('details');
  const setExpanded = () => { details.open = desktop.matches; };
  setExpanded();
  desktop.addEventListener('change', setExpanded);
  let current = -1;
  let scheduled = false;
  function update() {
    scheduled = false;
    let index = 0;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 100) index = i;
      else break;
    }
    if (index === current) return;
    if (current >= 0) links[current].removeAttribute('aria-current');
    links[index].setAttribute('aria-current', 'location');
    current = index;
    const nav = sidebar.querySelector('nav');
    if (desktop.matches && !sidebar.matches(':hover') && !sidebar.contains(document.activeElement)) {
      const box = links[index].getBoundingClientRect();
      const viewport = nav.getBoundingClientRect();
      if (box.top < viewport.top || box.bottom > viewport.bottom) {
        nav.scrollTop += box.top - viewport.top - nav.clientHeight / 3;
      }
    }
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  // Lazy-loaded figures can move headings after a TOC jump.
  content.addEventListener('load', schedule, true);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(content);
  update();
})();
