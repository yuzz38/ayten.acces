/* ayten.acces — © 2026 Полунин Лев. Без зависимостей, ES2017+, iOS Safari 12+, Android Chrome. */
(function () {
  'use strict';
  var d = document, w = window;
  d.documentElement.classList.add('js');
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IG = 'https://ig.me/m/ayten.acces';

  /* ---------- header + burger ---------- */
  var hdr = d.querySelector('.hdr'), burger = d.getElementById('burger'), nav = d.getElementById('nav');
  function onScroll() { hdr.classList.toggle('is-scrolled', w.pageYOffset > 20); }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    d.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  w.addEventListener('resize', function () { if (w.innerWidth > 860) setMenu(false); });

  /* ---------- toast + заказ ---------- */
  var toastEl = d.getElementById('toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }
  function copy(text) {
    if (navigator.clipboard && w.isSecureContext) return navigator.clipboard.writeText(text).catch(fallback);
    fallback(); return Promise.resolve();
    function fallback() {
      var ta = d.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      d.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      try { d.execCommand('copy'); } catch (e) {}
      d.body.removeChild(ta);
    }
  }

  /* ---------- конструктор: имя стразами на крабике ---------- */
  var cv = d.getElementById('clipCanvas'), input = d.getElementById('nameInput');
  var CLIPS = {
    pink:  { a: '#F7CAD8', b: '#EDA9BF', c: '#FBE0E8', t: '#E79AB3', n: 'розовый' },
    pearl: { a: '#FBF7F2', b: '#E6DDD5', c: '#FFFFFF', t: '#DCD2CA', n: 'жемчужный' },
    lilac: { a: '#E1D6F2', b: '#C7B6E6', c: '#F2ECFB', t: '#B9A6DE', n: 'лавандовый' },
    sky:   { a: '#D3E6F6', b: '#A9CBEA', c: '#EEF6FD', t: '#9CC0E3', n: 'голубой' }
  };
  var STONES = { ab: 'перелив (AB)', pink: 'розовые', blue: 'синие' };
  var state = { name: 'Aizira', clip: 'pink', stone: 'ab', typed: false };
  var DEMO = ['Aizira', 'Victoria', 'Саля', 'Afsana', 'Polina', 'Самира', 'Selin', 'Julia'];

  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), base = d.createElement('canvas'), bctx = base.getContext('2d');
    var lastKey = '', W = 640, H = 380, dpr = 1, dots = [], revealStart = 0, raf = 0, visible = true, sparks = [];

    var resize = function () {
      dpr = Math.min(w.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr; base.width = W * dpr; base.height = H * dpr;
    };

    var rand = (function () { var s = 7; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

    var clipPath = function (c) {
      var x = 70, y = 150, bw = 500, bh = 150, r = 70;
      c.beginPath();
      c.moveTo(x + r, y); c.lineTo(x + bw * 0.2, y);
      // «ушко» сверху
      c.bezierCurveTo(x + bw * 0.2, y - 95, x + bw * 0.48, y - 95, x + bw * 0.48, y);
      c.lineTo(x + bw - r, y);
      c.quadraticCurveTo(x + bw, y, x + bw, y + r);
      c.quadraticCurveTo(x + bw, y + bh, x + bw - r, y + bh);
      c.lineTo(x + r, y + bh);
      c.quadraticCurveTo(x, y + bh, x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
      return { x: x, y: y, bw: bw, bh: bh };
    };

    var drawClip = function (c, col) {
      c.save();
      // зубчики
      c.fillStyle = col.t;
      for (var i = 0; i < 9; i++) {
        var tx = 120 + i * 47;
        c.beginPath(); c.moveTo(tx, 280); c.lineTo(tx, 318);
        c.quadraticCurveTo(tx + 13, 334, tx + 26, 318); c.lineTo(tx + 26, 280); c.fill();
      }
      c.shadowColor = 'rgba(78,20,39,.28)'; c.shadowBlur = 28; c.shadowOffsetY = 14;
      var g = clipPath(c);
      var lg = c.createLinearGradient(0, 60, 0, 300);
      lg.addColorStop(0, col.c); lg.addColorStop(.45, col.a); lg.addColorStop(1, col.b);
      c.fillStyle = lg; c.fill();
      c.shadowColor = 'transparent';
      c.clip();
      // перламутровые разводы
      var r2 = (function () { var s = 3; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
      for (var k = 0; k < 16; k++) {
        var ex = g.x + r2() * g.bw, ey = 50 + r2() * 260, rr = 30 + r2() * 90;
        var rg = c.createRadialGradient(ex, ey, 0, ex, ey, rr);
        rg.addColorStop(0, 'rgba(255,255,255,' + (0.25 + r2() * 0.35) + ')'); rg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = rg; c.fillRect(ex - rr, ey - rr, rr * 2, rr * 2);
      }
      // блик
      var hl = c.createLinearGradient(0, g.y, 0, g.y + 40);
      hl.addColorStop(0, 'rgba(255,255,255,.75)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = hl; c.fillRect(g.x, g.y - 100, g.bw, 140);
      c.restore();
      c.save(); clipPath(c); c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.7)'; c.stroke(); c.restore();
    };

    var layout = function (name) {
      var off = d.createElement('canvas'); off.width = W; off.height = H;
      var o = off.getContext('2d');
      var maxW = 420, maxH = 110, fs = 120;
      o.font = fs + 'px "Marck Script", cursive';
      var mw = o.measureText(name).width;
      fs = Math.min(fs, fs * maxW / mw, maxH * 1.25);
      o.font = fs + 'px "Marck Script", cursive';
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillStyle = '#000'; o.fillText(name, 320, 222);
      var data = o.getImageData(0, 0, W, H).data;
      var rd = Math.max(2.6, fs * 0.036), step = rd * 2.05, cell = step, grid = {}, out = [];
      for (var yy = 100; yy < 340; yy += 1.5) {
        for (var xx = 60; xx < 590; xx += 1.5) {
          var ix = ((yy | 0) * W + (xx | 0)) * 4 + 3;
          if (data[ix] < 140) continue;
          var gx = Math.floor(xx / cell), gy = Math.floor(yy / cell), ok = true;
          for (var a = -1; a <= 1 && ok; a++) for (var b = -1; b <= 1 && ok; b++) {
            var l = grid[(gx + a) + ',' + (gy + b)];
            if (l) for (var q = 0; q < l.length; q++) { var p = l[q]; if ((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy) < step * step) { ok = false; break; } }
          }
          if (!ok) continue;
          var pt = { x: xx, y: yy, r: rd * (0.9 + rand() * 0.2), h: rand() * 360 };
          (grid[gx + ',' + gy] = grid[gx + ',' + gy] || []).push(pt); out.push(pt);
        }
      }
      out.sort(function (m, n) { return m.x - n.x; });
      return out;
    };

    var stone = function (c, p) {
      var t = state.stone, g = c.createRadialGradient(p.x - p.r * .35, p.y - p.r * .4, p.r * .1, p.x, p.y, p.r);
      if (t === 'ab') { g.addColorStop(0, '#fff'); g.addColorStop(.45, 'hsl(' + p.h + ',80%,86%)'); g.addColorStop(1, '#8f8c9e'); }
      else if (t === 'pink') { g.addColorStop(0, '#fff'); g.addColorStop(.4, '#F58AB3'); g.addColorStop(1, '#B42D63'); }
      else { g.addColorStop(0, '#fff'); g.addColorStop(.4, '#5C80EA'); g.addColorStop(1, '#1B3591'); }
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.2832); c.fillStyle = g; c.fill();
      c.lineWidth = .7; c.strokeStyle = 'rgba(60,30,50,.25)'; c.stroke();
    };

    var spark = function (c, x, y, s, a) {
      c.save(); c.globalAlpha = a; c.fillStyle = '#fff'; c.translate(x, y);
      c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(0, 0, s, 0); c.quadraticCurveTo(0, 0, 0, s);
      c.quadraticCurveTo(0, 0, -s, 0); c.quadraticCurveTo(0, 0, 0, -s); c.fill(); c.restore();
    };

    var renderBase = function (count) {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, W, H);
      drawClip(bctx, CLIPS[state.clip]);
      for (var i = 0; i < count; i++) stone(bctx, dots[i]);
    };

    var frame = function (ts) {
      raf = 0;
      var total = dots.length, dur = reduce ? 0 : 1100;
      var shown = dur ? Math.min(total, Math.floor(total * (ts - revealStart) / dur)) : total;
      var key = shown + '|' + state.clip + '|' + state.stone + '|' + state.name + '|' + dpr;
      if (key !== lastKey) { renderBase(shown); lastKey = key; }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (shown >= total && total && !reduce) {
        if (sparks.length < 4 && Math.random() < .08) { var p = dots[(Math.random() * total) | 0]; sparks.push({ x: p.x, y: p.y, t: ts }); }
        sparks = sparks.filter(function (s) {
          var k = (ts - s.t) / 900; if (k > 1) return false;
          spark(ctx, s.x, s.y, 9 * Math.sin(k * Math.PI), Math.sin(k * Math.PI)); return true;
        });
      }
      if (visible && (!reduce || shown < total)) raf = requestAnimationFrame(frame);
      if (reduce && shown >= total) raf = 0;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(frame); };

    var setName = function (n, animate) {
      state.name = (n || '').trim() || 'Её имя';
      dots = layout(state.name); sparks = [];
      revealStart = animate ? performance.now() : -1e9;
      kick();
    };

    resize();
    var start = function () { setName(state.name, true); };
    if (d.fonts && d.fonts.load) d.fonts.load('60px "Marck Script"').then(start, start); else setTimeout(start, 300);

    // цикл демо-имён, пока пользователь не начал печатать
    var di = 0;
    setInterval(function () {
      if (state.typed || !visible || d.hidden) return;
      di = (di + 1) % DEMO.length; setName(DEMO[di], true);
    }, 3200);

    var tmr;
    input.addEventListener('input', function () {
      state.typed = true; clearTimeout(tmr);
      var v = input.value.replace(/[<>]/g, '');
      tmr = setTimeout(function () { setName(v, true); }, 160);
    });

    function bindChips(attr, key) {
      var list = d.querySelectorAll('[data-' + attr + ']');
      Array.prototype.forEach.call(list, function (b) {
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(list, function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
          b.classList.add('is-on'); b.setAttribute('aria-checked', 'true');
          state[key] = b.getAttribute('data-' + attr); kick();
        });
      });
    }
    bindChips('clip', 'clip'); bindChips('stone', 'stone');

    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) kick(); }).observe(cv);
    }
    w.addEventListener('resize', function () { var o = dpr; resize(); if (o !== dpr) kick(); });
  }

  /* ---------- кнопки заказа: копируем текст и открываем директ ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('[data-order]'), function (a) {
    a.addEventListener('click', function () {
      var tag = a.getAttribute('data-order'), msg;
      if (tag === 'studio' || (!tag && state.typed)) {
        msg = 'Здравствуйте! Хочу именной крабик. Имя: ' + state.name + '. Цвет крабика: ' + CLIPS[state.clip].n + '. Стразы: ' + STONES[state.stone] + '.';
      } else if (tag) {
        msg = 'Здравствуйте! Интересует: ' + tag + '. Имя: ';
      } else {
        msg = 'Здравствуйте! Хочу заказать именной подарок. Имя: ';
      }
      copy(msg);
      toast('Текст заказа скопирован — вставьте его в директ @ayten.acces');
    });
  });

  /* ---------- видео процесса: играет только в зоне видимости ---------- */
  var vid = d.querySelector('.how__video');
  if (vid && 'IntersectionObserver' in w && !reduce) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { vid.preload = 'auto'; var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
      else vid.pause();
    }, { threshold: .25 }).observe(vid);
  }

  /* ---------- слайдер отзывов ---------- */
  var slider = d.getElementById('slider');
  if (slider) {
    var track = slider.querySelector('.slider__track'), slides = track.children, dotsBox = d.getElementById('dots');
    var idx = 0, per = 3, pages = 1, auto;
    var calc = function () {
      per = w.innerWidth <= 700 ? 1 : (w.innerWidth <= 1100 ? 2 : 3);
      pages = Math.max(1, slides.length - per + 1);
      dotsBox.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = d.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { go(n); restart(); }); })(i);
        dotsBox.appendChild(b);
      }
      go(Math.min(idx, pages - 1), true);
    };
    var go = function (n, instant) {
      idx = (n + pages) % pages;
      if (instant) track.style.transition = 'none';
      track.style.transform = 'translate3d(' + (-idx * 100 / per) + '%,0,0)';
      if (instant) { track.offsetHeight; track.style.transition = ''; }
      Array.prototype.forEach.call(dotsBox.children, function (b, i) { b.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    };
    // translate3d в % считается от ширины трека = ширина видимой области
    var restart = function () { clearInterval(auto); if (!reduce) auto = setInterval(function () { go(idx + 1); }, 6000); };
    Array.prototype.forEach.call(d.querySelectorAll('.rev-btn'), function (b) {
      b.addEventListener('click', function () { go(idx + (+b.getAttribute('data-dir'))); restart(); });
    });
    slider.addEventListener('mouseenter', function () { clearInterval(auto); });
    slider.addEventListener('mouseleave', restart);

    // свайп (pointer + touch fallback)
    var sx = 0, sy = 0, dx = 0, drag = false, lock = null;
    var down = function (x, y) { sx = x; sy = y; dx = 0; drag = true; lock = null; clearInterval(auto); };
    var move = function (x, y, e) {
      if (!drag) return;
      dx = x - sx; var dy = y - sy;
      if (lock === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (lock === 'x') {
        if (e && e.cancelable) e.preventDefault();
        slider.classList.add('is-drag'); track.style.transition = 'none';
        track.style.transform = 'translate3d(calc(' + (-idx * 100 / per) + '% + ' + dx + 'px),0,0)';
      }
    };
    var up = function () {
      if (!drag) return; drag = false; slider.classList.remove('is-drag'); track.style.transition = '';
      if (lock === 'x' && Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1)); else go(idx);
      restart();
    };
    if ('ontouchstart' in w) {
      slider.addEventListener('touchstart', function (e) { down(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      slider.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
      slider.addEventListener('touchend', up); slider.addEventListener('touchcancel', up);
    } else {
      slider.addEventListener('mousedown', function (e) { e.preventDefault(); down(e.clientX, e.clientY); });
      w.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
      w.addEventListener('mouseup', up);
    }
    var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(calc, 150); });
    calc(); restart();
  }

  /* ---------- появление блоков ---------- */
  var rv = d.querySelectorAll('.sec-head, .h2--center, .ph, .steps li, .occ__list li, .faq details, .build, .names__wall, .final__in');
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(rv, function (el) { el.classList.add('rv'); io.observe(el); });
  }

  var y = d.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
