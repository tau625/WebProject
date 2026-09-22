/* ============================================================
   作品系统 —— 数据驱动的作品档案
   后续改造为艺术集展示站：新增作品只需在 WORKS 里加一条数据
   ============================================================ */
window.AcidWorks = (() => {
  // —— 作品数据模型（改造为艺术集站时的核心资产）——
  // id 唯一 / no 编号 / title·titleEn 名称 / year 年份
  // tags 分类（液态·铬·全息·故障·平面）/ art 图形语言 / medium 材质说明
  // desc 作品描述 / featured 是否首页精选
  const WORKS = [
    { id: 'w01', no: '001', title: '液态信号', titleEn: 'LIQUID SIGNAL', year: '2026', tags: ['liquid'], art: 'liquid', medium: 'CSS / SVG 生成图形', desc: '把一整套通讯信号倒进液态金属里。轮廓永远在犹豫要不要融化。', featured: true },
    { id: 'w02', no: '002', title: '铬球', titleEn: 'CHROME ORB', year: '2026', tags: ['chrome'], art: 'chrome', medium: '锥形渐变 / 高光扫描', desc: '抛光到刺眼的金属梦境。反射里住着另一个舞池。', featured: true },
    { id: 'w03', no: '003', title: '全息箔', titleEn: 'HOLO FOIL', year: '2026', tags: ['holo'], art: 'holo', medium: '全息渐变 / 角度变色', desc: '在两种色相之间反复横跳，拒绝定格成一种颜色。', featured: true },
    { id: 'w04', no: '004', title: '液化错误', titleEn: 'ERROR MELTED', year: '2026', tags: ['glitch', 'liquid'], art: 'glitch', medium: 'RGB 分层 / 切片位移', desc: '信号断裂的四毫秒，被放大成一整张画面。错误即笔触。', featured: false },
    { id: 'w05', no: '005', title: '搜打撤', titleEn: 'SEARCH LOOT EXTRACT', year: '2026', tags: ['flat'], art: 'flat', medium: '平色块 / 贴纸拼贴', desc: '三块色面，三个动作。扁平海报语言的酸性直译。', featured: false },
    { id: 'w06', no: '006', title: '网点斜切', titleEn: 'HALFTONE SLANT', year: '2026', tags: ['flat'], art: 'halftone', medium: '网点 / 斜切 / 危险条纹', desc: '版式零件的再编排：网点遇上斜切，秩序里的失衡。', featured: false },
    { id: 'w07', no: '007', title: '反应式三阶', titleEn: 'REACTIVE TRIAD', year: '2026', tags: ['chrome', 'holo'], art: 'reactive', medium: '三阶段渐变 / 扫光', desc: '一次关于进化材质的研究：从冷凝到熔解，三段渐变的推力。', featured: false },
    { id: 'w08', no: '008', title: '星屑贴纸', titleEn: 'STELLAR STICKER', year: '2026', tags: ['flat', 'glitch'], art: 'sticker', medium: '贴纸 / 描边字 / 故障底纹', desc: '贴纸簿的一页。撕下来，贴在任何信号上。', featured: false }
  ];

  const TAGS = [
    { id: 'all', label: '全部 ALL' },
    { id: 'liquid', label: '液态 LIQUID' },
    { id: 'chrome', label: '铬 CHROME' },
    { id: 'holo', label: '全息 HOLO' },
    { id: 'glitch', label: '故障 GLITCH' },
    { id: 'flat', label: '平面 FLAT' }
  ];

  const GLYPH = { w05: '撤', w08: '✦', w06: '06' };

  // —— 图形语言渲染（全部复用站内酸性材质词汇）——
  const ART_KINDS = ['liquid', 'chrome', 'holo', 'glitch', 'flat', 'halftone', 'reactive', 'sticker'];
  const ART_TPL = {};
  function artMarkup(kind, id) {
    if (ART_KINDS.indexOf(kind) < 0) kind = 'liquid';
    switch (kind) {
      case 'liquid':
        return '<div class="wa wa-liquid"><div class="liquid-blob"></div></div>';
      case 'chrome':
        return '<div class="wa wa-chrome"><div class="chrome-orb"><i class="shine"></i></div></div>';
      case 'holo':
        return '<div class="wa wa-holo"><div class="holo-panel"></div></div>';
      case 'glitch':
        return '<div class="wa wa-glitch"><div class="glitch-stack"><span class="gs gs-r">ERROR 液化</span><span class="gs gs-c">ERROR 液化</span><span class="gs">ERROR 液化</span></div></div>';
      case 'flat':
        return '<div class="wa wa-flat"><i class="wf-shape s1"></i><i class="wf-shape s2"></i>' +
          '<svg class="wf-star"><use href="#sparkle"/></svg>' +
          '<span class="wf-glyph">' + (GLYPH[id] || '✦') + '</span></div>';
      case 'halftone':
        return '<div class="wa wa-halftone"><div class="wf-slant"></div><div class="wf-dots"></div><div class="wf-hazard"></div></div>';
      case 'reactive':
        return '<div class="wa wa-reactive"><span class="stage st-1"><i>STG.01</i></span><span class="stage st-2"><i>STG.02</i></span><span class="stage st-3"><i>STG.03</i></span><i class="shimmer"></i></div>';
      case 'sticker':
        return '<div class="wa wa-sticker"><i class="wf-shape s1"></i><i class="wf-shape s2"></i><svg class="wf-star big"><use href="#sparkle"/></svg><span class="wf-glyph">✦</span></div>';
      default:
        return '<div class="wa wa-liquid"><div class="liquid-blob"></div></div>';
    }
  }

  function tagLabel(id) {
    const t = TAGS.find((x) => x.id === id);
    return t ? t.label.split(' ')[0] : id;
  }

  function cardMarkup(w, opts) {
    const base = opts && opts.linkBase ? opts.linkBase : '#';
    const stag = opts && typeof opts.index === 'number' ? ' data-reveal style="--d:' + Math.min(opts.index, 4) + '"' : ' data-reveal';
    return '<a class="mat-card tilt work-card" href="' + base + w.id + '" data-work="' + w.id + '"' + stag + '>' +
      '<div class="mat-art">' + artMarkup(w.art, w.id) + '</div>' +
      '<div class="mat-meta">' +
        '<span class="mat-idx">W.' + w.no + ' / ' + w.year + '</span>' +
        '<h3 class="mat-name">' + w.title + ' <em>' + w.titleEn + '</em></h3>' +
        '<p class="mat-cite">' + w.medium + '</p>' +
        '<span class="mat-tag">' + w.tags.map(tagLabel).join(' · ') + '</span>' +
      '</div></a>';
  }

  function renderGrid(container, works, opts) {
    container.innerHTML = works.map((w, i) => cardMarkup(w, { linkBase: opts && opts.linkBase, index: i })).join('');
    wireCards(container);
    if (window.AcidReveal) window.AcidReveal(container);
  }

  function renderFeatured(container) {
    const n = parseInt(container.getAttribute('data-works-featured') || '3', 10);
    renderGrid(container, WORKS.filter((w) => w.featured).slice(0, n), { linkBase: 'works.html#' });
  }

  function renderFilters(container) {
    container.innerHTML = TAGS.map((t, i) =>
      '<button class="filter-chip' + (i === 0 ? ' on' : '') + '" type="button" data-tag="' + t.id + '" aria-pressed="' + (i === 0) + '">' + t.label + '</button>'
    ).join('');
  }

  // —— 详情灯箱 ——
  let lb, lbArt, lbNo, lbTitle, lbEn, lbDesc, lbTags, lbMedium;
  let current = 0;
  let lastFocus = null;

  function fillLightbox(i) {
    const w = WORKS[i];
    current = i;
    lbArt.replaceChildren();
    const artNode = ART_TPL[w.art] ? ART_TPL[w.art].content.cloneNode(true) : null;
    if (artNode) {
      const g = artNode.querySelector('.wf-glyph');
      if (g) g.textContent = GLYPH[w.id] || '✦';
      lbArt.appendChild(artNode);
    }
    lbNo.textContent = 'W.' + w.no + ' / ' + w.year;
    lbTitle.textContent = w.title;
    lbEn.textContent = w.titleEn;
    lbDesc.textContent = w.desc;
    lbMedium.textContent = w.medium;
    lbTags.textContent = '';
    w.tags.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = tagLabel(t);
      lbTags.appendChild(li);
    });
  }

  // id → 档案下标：外部字符串（hash / data-work）在此被白名单查表消化为数字
  function resolveIndex(idOrIndex) {
    if (typeof idOrIndex === 'number') return (Number.isInteger(idOrIndex) && idOrIndex >= 0 && idOrIndex < WORKS.length) ? idOrIndex : -1;
    if (typeof idOrIndex === 'string') return WORKS.findIndex((w) => w.id === idOrIndex);
    return -1;
  }

  function openLightbox(index) {
    if (!lb) return;
    const i = resolveIndex(index); // 只接受档案下标；渲染内容全部来自静态 WORKS
    if (i < 0) return;
    lastFocus = document.activeElement;
    fillLightbox(i);
    lb.hidden = false;
    document.body.classList.add('lb-open');
    const closeBtn = lb.querySelector('.lb-close');
    if (closeBtn) closeBtn.focus();
    if (location.hash !== '#' + WORKS[i].id) history.replaceState(null, '', '#' + WORKS[i].id);
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(delta) {
    const i = (current + delta + WORKS.length) % WORKS.length;
    fillLightbox(i);
    history.replaceState(null, '', '#' + WORKS[i].id);
  }

  function wireCards(container) {
    container.querySelectorAll('[data-work]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!lb) return; // 首页无灯箱时保留原生跳转
        e.preventDefault();
        const idx = resolveIndex(card.getAttribute('data-work'));
        if (idx >= 0) openLightbox(idx);
      });
    });
  }

  function init() {
    // 图形模板：常量字符串一次性解析为 template，openLightbox 渲染路径零 innerHTML
    ART_KINDS.forEach((kind) => {
      const tpl = document.createElement('template');
      tpl.innerHTML = artMarkup(kind, '_tpl_');
      ART_TPL[kind] = tpl;
    });
    document.querySelectorAll('[data-works-featured]').forEach(renderFeatured);
    document.querySelectorAll('[data-works-grid]').forEach((g) => {
      renderGrid(g, WORKS, { linkBase: '#' });
    });
    document.querySelectorAll('[data-work-filters]').forEach((f) => {
      renderFilters(f);
      f.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (!btn) return;
        f.querySelectorAll('.filter-chip').forEach((b) => {
          b.classList.toggle('on', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        const tag = btn.getAttribute('data-tag');
        const list = tag === 'all' ? WORKS : WORKS.filter((w) => w.tags.indexOf(tag) >= 0);
        const grid = document.querySelector('[data-works-grid]');
        if (grid) renderGrid(grid, list, { linkBase: '#' });
        const count = document.querySelector('[data-works-count]');
        if (count) count.textContent = String(list.length).padStart(2, '0') + ' WORKS';
        if (window.AcidReveal) {
          // 筛选后的新卡片等不到 IO 就直接放行，避免闪烁延迟
          setTimeout(() => {
            document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => el.classList.add('in'));
          }, 60);
        }
      });
    });

    lb = document.getElementById('lightbox');
    if (lb) {
      lbArt = lb.querySelector('.lb-art');
      lbNo = lb.querySelector('.lb-no');
      lbTitle = lb.querySelector('.lb-title');
      lbEn = lb.querySelector('.lb-en');
      lbDesc = lb.querySelector('.lb-desc');
      lbTags = lb.querySelector('.lb-tags');
      lbMedium = lb.querySelector('.lb-medium');
      lb.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeLightbox));
      const prev = lb.querySelector('.lb-prev');
      const next = lb.querySelector('.lb-next');
      if (prev) prev.addEventListener('click', () => step(-1));
      if (next) next.addEventListener('click', () => step(1));
      document.addEventListener('keydown', (e) => {
        if (lb.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
      });
      const openFromHash = () => {
        const m = (location.hash || '').match(/^#(w\d+)$/);
        const idx = m ? WORKS.findIndex((w) => w.id === m[1]) : -1;
        if (idx >= 0) openLightbox(idx); // 外部字符串只做查表，不进入渲染链路
      };
      openFromHash();
      window.addEventListener('hashchange', openFromHash);
    }
  }

  return { WORKS, TAGS, artMarkup, renderGrid, renderFeatured, openLightbox, closeLightbox, init };
})();

window.AcidWorks.init();
