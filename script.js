/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count: window.innerWidth < 768 ? 50 : 100,
    maxDist: 120,
    speed: 0.4,
    color: '0,212,255',
    radius: 2,
    mouseRepel: 100,
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * CONFIG.radius + 0.8,
      opacity: Math.random() * 0.5 + 0.3,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Mouse repel
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRepel) {
        const force = (CONFIG.mouseRepel - dist) / CONFIG.mouseRepel;
        p.vx += (dx / dist) * force * 0.8;
        p.vy += (dy / dist) * force * 0.8;
      }

      // Damping
      p.vx *= 0.98; p.vy *= 0.98;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > CONFIG.speed * 3) { p.vx *= 0.95; p.vy *= 0.95; }

      p.x += p.vx; p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color},${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONFIG.maxDist) {
          const alpha = (1 - d / CONFIG.maxDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  init();
  draw();
})();


/* ===== TYPEWRITER ===== */
(function typewriter() {
  const el = document.getElementById('typewriter');
  const roles = [
    'Senior Software Engineer',
    'BRMS Specialist',
    'Decision Automation Expert',
    'IBM ODM / BAW Developer',
    'Java & Spring Boot Dev',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 1000);
})();


/* ===== CUSTOM CURSOR ===== */
(function cursor() {
  const dot = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-follower');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, .skill-card, .edu-card, .timeline-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();


/* ===== NAVBAR ===== */
(function navbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


/* ===== SCROLL PROGRESS ===== */
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
})();


/* ===== BACK TO TOP ===== */
(function backToTop() {
  const btn = document.getElementById('backTop');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ===== INTERSECTION OBSERVER — REVEAL ===== */
(function revealOnScroll() {
  const els = document.querySelectorAll('.reveal, .reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();


/* ===== COUNTER ANIMATION ===== */
(function counters() {
  const els = document.querySelectorAll('.count');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const step = target / 50;
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();


/* ===== SKILL BAR ANIMATION ===== */
(function skillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      fill.style.width = fill.dataset.pct + '%';
      io.unobserve(fill);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();


/* ===== SKILL TABS ===== */
(function skillTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        }
      });
    });
  });
})();


/* ===== NAV SCROLL SPY ===== */
(function scrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
})();


/* ===== HERO STAGGER ANIMATION ===== */
(function heroEntrance() {
  const items = document.querySelectorAll('.hero-content .reveal-up');
  items.forEach((el, i) => {
    el.style.transitionDelay = `${0.1 + i * 0.12}s`;
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
})();


/* ===== CONTACT FORM ===== */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }, 1500);
  });
})();
