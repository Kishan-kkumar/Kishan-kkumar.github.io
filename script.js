/* ===========================
   PRELOADER — cinematic curtain
   =========================== */
(function preloader() {
  const loader  = document.getElementById('preloader');
  const bar     = document.getElementById('preBar');
  const count   = document.getElementById('preCount');
  const top     = loader.querySelector('.pre-top');
  const bot     = loader.querySelector('.pre-bot');
  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 4 + 1;
    if (pct >= 100) { pct = 100; clearInterval(interval); openCurtains(); }
    bar.style.width = pct + '%';
    count.textContent = Math.floor(pct) + '%';
  }, 40);

  function openCurtains() {
    setTimeout(() => {
      top.classList.add('open-top');
      bot.classList.add('open-bot');
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; startHero(); }, 900);
    }, 400);
  }
})();


/* ===========================
   HERO ENTRANCE (after preloader)
   =========================== */
function startHero() {
  // Split letters
  function splitInto(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = text.split('').map((ch, i) =>
      `<span class="letter" style="transition-delay:${i * 0.055}s">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    el.querySelectorAll('.letter').forEach((l, i) => {
      setTimeout(() => l.classList.add('in'), 50 + i * 55);
    });
  }
  splitInto('nameFirst', 'Kishan');
  splitInto('nameLast',  'Kumar');

  // Set glitch data attribute
  const glitch = document.getElementById('nameLast');
  if (glitch) glitch.setAttribute('data-text', 'Kumar');

  // Reveal rest of hero content
  document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
    el.style.transitionDelay = `${0.4 + i * 0.12}s`;
    setTimeout(() => el.classList.add('visible'), 400 + i * 120);
  });
}


/* ===========================
   FILM GRAIN CANVAS
   =========================== */
(function filmGrain() {
  const canvas = document.getElementById('filmGrain');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrain() {
    const img  = ctx.createImageData(canvas.width, canvas.height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(drawGrain, 120);
})();


/* ===========================
   SPOTLIGHT CURSOR
   =========================== */
(function spotlight() {
  const sp = document.getElementById('spotlight');
  if (!sp) return;
  document.addEventListener('mousemove', e => {
    sp.style.left = e.clientX + 'px';
    sp.style.top  = e.clientY + 'px';
  });
})();


/* ===========================
   PARTICLE CANVAS
   =========================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count: window.innerWidth < 768 ? 55 : 110,
    maxDist: 130,
    speed: 0.45,
    color: '0,212,255',
    radius: 2,
    mouseRepel: 110,
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * CONFIG.radius + 0.8,
      op: Math.random() * 0.5 + 0.3,
    };
  }

  function init() { resize(); particles = Array.from({ length: CONFIG.count }, mkParticle); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < CONFIG.mouseRepel) {
        const f = (CONFIG.mouseRepel - d) / CONFIG.mouseRepel;
        p.vx += (dx / d) * f * 0.9;
        p.vy += (dy / d) * f * 0.9;
      }
      p.vx *= 0.98; p.vy *= 0.98;
      const sp = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      if (sp > CONFIG.speed * 3) { p.vx *= 0.94; p.vy *= 0.94; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${CONFIG.color},${p.op})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dd = Math.sqrt(dx*dx + dy*dy);
        if (dd < CONFIG.maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.color},${(1 - dd/CONFIG.maxDist)*0.28})`;
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  init(); draw();
})();


/* ===========================
   TYPEWRITER
   =========================== */
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = [
    'Senior Software Engineer',
    'BRMS Specialist',
    'Decision Automation Expert',
    'IBM ODM / BAW Developer',
    'Java & Spring Boot Dev',
  ];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; return setTimeout(tick, 2000); }
      setTimeout(tick, 80);
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri+1) % roles.length; return setTimeout(tick, 400); }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 3200); // start after preloader
})();


/* ===========================
   GLITCH EFFECT on name
   =========================== */
(function glitchLoop() {
  function glitch() {
    const el = document.getElementById('nameLast');
    if (!el) return;
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 200);
  }
  // Random glitch every 3-7 seconds
  function scheduleGlitch() {
    setTimeout(() => { glitch(); scheduleGlitch(); }, 3000 + Math.random() * 4000);
  }
  setTimeout(scheduleGlitch, 5000);
})();


/* ===========================
   CUSTOM CURSOR
   =========================== */
(function cursor() {
  const dot  = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-follower');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function anim() {
    rx += (mx-rx) * 0.12; ry += (my-ry) * 0.12;
    dot.style.left  = mx+'px'; dot.style.top  = my+'px';
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a,button,.skill-card,.edu-card,.timeline-card,.cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();


/* ===========================
   3D CARD TILT
   =========================== */
(function cardTilt() {
  const cards = document.querySelectorAll('.skill-card, .timeline-card, .edu-card, .cert-card');
  cards.forEach(card => {
    // Add shine overlay
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) *  8;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease, border-color 0.3s';
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
      // update shine position
      shine.style.setProperty('--mx', (x / r.width  * 100) + '%');
      shine.style.setProperty('--my', (y / r.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s, border-color 0.3s';
      card.style.transform = '';
    });
  });
})();


/* ===========================
   MAGNETIC BUTTONS
   =========================== */
(function magneticButtons() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx*0.25}px, ${dy*0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ===========================
   NAVBAR
   =========================== */
(function navbar() {
  const nav  = document.getElementById('navbar');
  const hbg  = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
  hbg.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();


/* ===========================
   SCROLL PROGRESS
   =========================== */
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  });
})();


/* ===========================
   BACK TO TOP
   =========================== */
(function backTop() {
  const btn = document.getElementById('backTop');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ===========================
   REVEAL ON SCROLL
   =========================== */
(function revealOnScroll() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-up').forEach(el => io.observe(el));
})();


/* ===========================
   COUNTER ANIMATION
   =========================== */
(function counters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.target;
      let cur = 0; const step = target / 50;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(t);
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count').forEach(el => io.observe(el));
})();


/* ===========================
   SKILL BAR ANIMATION
   =========================== */
(function skillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.pct + '%';
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill').forEach(f => io.observe(f));
})();


/* ===========================
   SKILL TABS
   =========================== */
(function skillTabs() {
  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.skill-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ===========================
   NAV SCROLL SPY
   =========================== */
(function scrollSpy() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
})();


/* ===========================
   TIMELINE LINE DRAW
   =========================== */
(function timelineDraw() {
  const tl = document.querySelector('.timeline');
  if (!tl) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { tl.classList.add('draw'); io.disconnect(); } });
  }, { threshold: 0.1 });
  io.observe(tl);
})();


/* ===========================
   CONTACT FORM
   =========================== */
(function contactForm() {
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;
    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      btn.disabled  = false;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }, 1500);
  });
})();
