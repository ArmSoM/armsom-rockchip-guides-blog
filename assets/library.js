(() => {
  'use strict';
  const shell = document.querySelector('[data-library]');
  if (!shell) return;
  const ui = JSON.parse(shell.dataset.ui), form = shell.querySelector('form');
  const query = form.elements.q, category = form.elements.category, product = form.elements.product, sort = form.elements.sort;
  const cards = shell.querySelector('#library-results'), status = shell.querySelector('[role=status]');
  const pager = shell.querySelector('.pagination'), size = 9;
  let items = [], activePage = 1, ready = false;
  const base = new URL(form.action);
  function restore() {
    const params = new URLSearchParams(location.search);
    query.value = (params.get('q') || '').slice(0, 200);
    category.value = params.get('category') || '';
    product.value = params.get('product') || '';
    sort.value = ['title', 'shortest'].includes(params.get('sort')) ? params.get('sort') : 'newest';
    const pathPage = location.pathname.match(/page-(\d+)\//);
    activePage = Math.max(1, Number(params.get('page') || (pathPage && pathPage[1]) || 1) || 1);
  }
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value; if (className) node.className = className; return node;
  };
  function urlFor(page) {
    const url = new URL(base);
    if (query.value.trim()) url.searchParams.set('q', query.value.trim());
    if (category.value) url.searchParams.set('category', category.value);
    if (product.value) url.searchParams.set('product', product.value);
    if (sort.value !== 'newest') url.searchParams.set('sort', sort.value);
    if (page > 1) url.searchParams.set('page', String(page));
    return url.pathname + url.search;
  }
  function render(writeHistory = false, focus = false) {
    if (!ready) return;
    const terms = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const filtered = items.filter(item => {
      const haystack = [item.title, item.description, ui.categories[item.category], ...(item.products || []), ...(item.tags || [])].join(' ').toLocaleLowerCase();
      return (!category.value || item.category === category.value) &&
        (!product.value || (item.products || []).includes(product.value)) &&
        terms.every(term => haystack.includes(term));
    });
    filtered.sort((a,b) => sort.value === 'title' ? a.title.localeCompare(b.title, shell.dataset.lang) : sort.value === 'shortest' ? a.minutes - b.minutes || b.name.localeCompare(a.name) : b.date.localeCompare(a.date) || b.name.localeCompare(a.name));
    const pages = Math.max(1, Math.ceil(filtered.length / size));
    activePage = Math.min(activePage, pages);
    cards.replaceChildren();
    for (const item of filtered.slice((activePage - 1) * size, activePage * size)) {
      const link = document.createElement('a'); link.className = 'card'; link.href = item.url;
      const labels = text('div', '', 'card-labels');
      labels.append(text('span', ui.categories[item.category] || item.category), text('span', (item.products || []).join(' · ')));
      const meta = text('div', '', 'card-meta'), time = text('time', item.date); time.dateTime = item.date;
      meta.append(time, text('span', item.minutes + ' ' + ui.minutes));
      link.append(labels, text('h3', item.title), text('p', item.description), meta); cards.append(link);
    }
    if (!filtered.length) cards.append(text('p', ui.empty, 'empty-state'));
    status.textContent = filtered.length + ' ' + ui.results + ' · ' + ui.page + ' ' + activePage + ' / ' + pages;
    pager.replaceChildren();
    for (let n = 1; n <= pages; n++) {
      const link = text('a', String(n)); link.href = urlFor(n);
      if (n === activePage) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); activePage = n; render(true, true);
      }); pager.append(link);
    }
    if (writeHistory) history.pushState(null, '', urlFor(activePage));
    if (focus) { status.tabIndex = -1; status.focus({preventScroll: true}); status.scrollIntoView({block: 'nearest', behavior: 'auto'}); }
  }
  restore();
  fetch(shell.dataset.index).then(response => {
    if (!response.ok) throw new Error('Index unavailable'); return response.json();
  }).then(data => {
    items = data.filter(item => item.lang === shell.dataset.lang).sort((a,b) => b.name.localeCompare(a.name));
    ready = true; render();
    form.addEventListener('submit', event => { event.preventDefault(); activePage = 1; render(true); });
    let debounce;
    query.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { activePage = 1; render(true); }, 250); });
    [category, product, sort].forEach(field => field.addEventListener('change', () => { activePage = 1; render(true); }));
    form.addEventListener('reset', event => { event.preventDefault(); query.value = category.value = product.value = ''; sort.value = 'newest'; activePage = 1; render(true); });
    window.addEventListener('popstate', () => { restore(); render(); });
  }).catch(() => { status.textContent = ui.loadError; });
})();
