document.addEventListener('DOMContentLoaded', () => {
  initPageNav();
  initHeader();
  initMobileNav();
  initTabs();
  initReadMore();
  initCounters();
  initHeroSlideshow();
});

const PAGE_TITLES = {
  home: 'SOGC INFRA | "Construct with Heart, Engineering with Mind"',
  about: 'SOGC INFRA | About Us',
  services: 'SOGC INFRA  | Services',
  projects: 'SOGC INFRA  | Projects',
  leadership: 'SOGC INFRA | Leadership',
  clients: 'SOGC INFRA  | Our Clients',
  strength: 'SOGC INFRA  | Our Strength',
  contact: 'SOGC INFRA | Contact Us',
};

function initPageNav() {
  const views = document.querySelectorAll('.page-view');
  if (!views.length) return;

  const switchPage = (page, pushState = true) => {
    if (!document.getElementById('page-' + page)) page = 'home';

    views.forEach(v => v.classList.toggle('active', v.id === 'page-' + page));

    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    document.body.classList.add('page-switching');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    document.body.classList.remove('page-switching');

    document.querySelector('.site-header')?.classList.remove('header-hidden');

    if (PAGE_TITLES[page]) document.title = PAGE_TITLES[page];

    if (pushState) {
      history.pushState({ page }, '', '#' + page);
    }
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    const page = link.dataset.page;
    if (!page) return;
    e.preventDefault();
    switchPage(page);
  });

  window.addEventListener('popstate', (e) => {
    const page = (e.state && e.state.page) || location.hash.replace('#', '') || 'home';
    switchPage(page, false);
  });

  const initial = location.hash.replace('#', '') || 'home';
  if (initial !== 'home') switchPage(initial, false);
  else switchPage('home', false);
}

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const current = window.scrollY;

    header.classList.toggle('scrolled', current > 60);

    if (header.classList.contains('nav-open') || current <= 60) {
      header.classList.remove('header-hidden');
    } else if (current > lastScrollY) {
      header.classList.add('header-hidden');
    } else if (current < lastScrollY) {
      header.classList.remove('header-hidden');
    }

    lastScrollY = current;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.main-nav .nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('active');
    document.querySelector('.site-header')?.classList.toggle('nav-open', isOpen);
    if (isOpen) {
      document.querySelector('.site-header')?.classList.remove('header-hidden');
    }
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('active');
      document.querySelector('.site-header')?.classList.remove('nav-open');
    });
  });
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabBtns = tabGroup.querySelectorAll('.tab-btn');
    const panels = tabGroup.parentElement.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach(panel => {
          panel.classList.toggle('active', panel.id === target);
        });
      });
    });
  });
}

function initReadMore() {
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.leader-info');
      const expanded = card.classList.toggle('expanded');
      btn.textContent = expanded ? 'Read Less' : 'Read More';
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      if (target % 1 !== 0) {
        el.textContent = prefix + value.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.round(value) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => show(current + 1);

  timer = setInterval(next, 5000);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      show(parseInt(dot.dataset.slide, 10));
      timer = setInterval(next, 5000);
    });
  });
}

function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const subject = form.querySelector('[name="subject"]').value;
  const message = form.querySelector('[name="message"]').value;

  const mailto = `mailto:patna.sogc@gmail.com?subject=${encodeURIComponent(subject || 'Business Inquiry from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
  window.location.href = mailto;

  const notice = form.querySelector('.form-notice');
  if (notice) {
    notice.textContent = 'Thank you! Your email client should open shortly.';
    notice.style.display = 'block';
  }
}
