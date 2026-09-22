/* ============================================================
   酸性信号 ACID SIGNAL — interactions
   ============================================================ */
(() => {
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- toast ---------- */
  const toastEl = doc.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  /* ---------- boot screen ---------- */
  const boot = doc.getElementById('boot');
  if (boot) {
    const closeBoot = () => {
      if (boot.classList.contains('done')) return;
      boot.classList.add('done');
      // 兜底：冻结/后台环境里 transitionend 不触发，850ms 后无论如何硬移除
      setTimeout(() => boot.remove(), 850);
    };
    if (reduced) {
      boot.remove();
    } else {
      const t = setTimeout(closeBoot, 1300);
      boot.addEventListener('click', () => { clearTimeout(t); closeBoot(); });
      window.addEventListener('load', () => setTimeout(closeBoot, 700), { once: true });
      boot.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'transform') boot.remove();
      });
    }
  }

  /* ---------- wave letters ---------- */
  doc.querySelectorAll('[data-wave]').forEach((el) => {
    const original = el.textContent.trim();
    const words = original.split(/\s+/);
    el.textContent = '';
    // 逐字动画仅供视觉，整句另存一份给读屏软件
    const sr = doc.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = original;
    el.appendChild(sr);
    let i = 0;
    words.forEach((word, wi) => {
      const wEl = doc.createElement('span');
      wEl.className = 'w';
      wEl.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const s = doc.createElement('span');
        s.className = 'wl';
        s.style.setProperty('--i', i++);
        s.textContent = ch;
        wEl.appendChild(s);
      });
      el.appendChild(wEl);
      if (wi < words.length - 1) el.appendChild(doc.createTextNode(' '));
    });
  });

  /* ---------- a11y: glitch 伪元素的 attr(data-text) 会被计入无障碍树，给宿主补干净标签 ---------- */
  doc.querySelectorAll('.glitch').forEach((el) => {
    const host = el.closest('h2, h3, a, button') || el.parentElement;
    if (host && !host.hasAttribute('aria-label')) {
      host.setAttribute('aria-label', host.textContent.replace(/\s+/g, ' ').trim());
    }
  });

  /* ---------- scroll reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  doc.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));
  // 动态渲染的内容（作品墙等）用这个入口接入滚动入场
  window.AcidReveal = (root) => {
    (root || doc).querySelectorAll('[data-reveal]:not(.in)').forEach((el) => revealIO.observe(el));
  };
  // 兜底：IO 不投递（后台/冻结标签页、老浏览器）时直接显示，避免内容永久透明
  setTimeout(() => {
    doc.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => el.classList.add('in'));
  }, 2500);

  /* ---------- custom cursor ---------- */
  const dot = doc.querySelector('.cursor-dot');
  const blobCursor = doc.querySelector('.cursor-blob');
  if (fine && !reduced && dot && blobCursor) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let bx = x;
    let by = y;
    window.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!body.classList.contains('cursor-on')) body.classList.add('cursor-on');
      dot.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });

    (function follow() {
      bx += (x - bx) * 0.16;
      by += (y - by) * 0.16;
      blobCursor.style.transform = `translate(${bx}px, ${by}px)`;
      requestAnimationFrame(follow);
    })();

    doc.querySelectorAll('a, button, .act, .tilt').forEach((el) => {
      el.addEventListener('mouseenter', () => blobCursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => blobCursor.classList.remove('grow'));
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (fine && !reduced) {
    doc.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          `perspective(900px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduced) {
    doc.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1)}px`);
        btn.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------- liquid distortion (animated turbulence) ---------- */
  const turbA = doc.getElementById('turbA');
  const dispA = doc.getElementById('dispA');
  const turbB = doc.getElementById('turbB');
  const dispB = doc.getElementById('dispB');

  if (!reduced && turbA && turbB && dispA && dispB) {
    let t = 0;
    let last = 0;
    (function fxLoop(now) {
      requestAnimationFrame(fxLoop);
      if (now - last < 70) return;
      last = now;
      t += 0.06;
      const boost = root.classList.contains('acid-max') ? 1.9 : 1;
      const bfA = 0.012 + Math.sin(t) * 0.0035;
      const bfB = 0.009 + Math.cos(t * 0.8) * 0.003;
      turbA.setAttribute('baseFrequency', `${bfA.toFixed(4)} ${(bfA * 2.1).toFixed(4)}`);
      dispA.setAttribute('scale', ((13 + Math.sin(t * 0.7) * 4) * boost).toFixed(1));
      turbB.setAttribute('baseFrequency', `${bfB.toFixed(4)} ${(bfB * 1.9).toFixed(4)}`);
      dispB.setAttribute('scale', ((7 + Math.cos(t * 0.6) * 3) * boost).toFixed(1));
    })(0);
  }

  /* ---------- ACID MAX toggle ---------- */
  const acidToggle = doc.getElementById('acidToggle');
  if (acidToggle) {
    acidToggle.addEventListener('click', () => {
      const on = root.classList.toggle('acid-max');
      acidToggle.classList.toggle('on', on);
      acidToggle.setAttribute('aria-pressed', String(on));
      toast(on ? 'ACID MAX ON · 失真已拉满' : 'ACID MAX OFF · 信号暂时干净');
    });
  }

  /* ---------- scroll progress ---------- */
  const bar = doc.getElementById('progressBar');
  if (bar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = doc.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        bar.style.transform = `scaleX(${p})`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- demo buttons ---------- */
  doc.querySelectorAll('[data-toast]').forEach((el) => {
    el.addEventListener('click', () => toast(el.dataset.toast));
  });
})();
