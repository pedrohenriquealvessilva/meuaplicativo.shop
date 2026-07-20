/* =========================================================
   ZENVEST — script.js
   Vanilla JS only. No dependencies.
   Organized into small, isolated init functions so future
   integrations (checkout, analytics, real auth) can hook in
   without touching unrelated UI logic.
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Header: solid background after scrolling past hero
     --------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile menu toggle
     --------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('mobileNav');
    if (!toggle || !nav) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal animations (IntersectionObserver)
     --------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // slight stagger for elements that reveal together
            setTimeout(function () {
              el.classList.add('is-visible');
            }, (i % 4) * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     FAQ accordion — single item open at a time
     --------------------------------------------------------- */
  function initAccordion() {
    var items = document.querySelectorAll('.accordion__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.accordion__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherTrigger = other.querySelector('.accordion__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------------------------------------------------------
     App demonstration tabs
     --------------------------------------------------------- */
  function initDemoTabs() {
    var tabs = document.querySelectorAll('.demo__tab');
    var panels = document.querySelectorAll('.demo__panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Hero balance counter — counts up once when visible
     --------------------------------------------------------- */
  function initBalanceCounter() {
    var el = document.getElementById('counterBalance');
    if (!el) return;

    var target = 2480;

    function animate() {
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString('pt-BR');
        return;
      }
      var start = null;
      var duration = 1400;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      animate();
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
  }

  /* ---------------------------------------------------------
     Smooth-scroll for in-page anchor links (covers browsers
     that don't fully honor CSS scroll-behavior) + closes
     mobile menu automatically via existing listeners.
     --------------------------------------------------------- */
  function initAnchorScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 84;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------------
     Plan CTA tracking hook — placeholder for future analytics
     / checkout integration. Each plan button already points
     to /mensal, /semestral or /vitalicio; this only prepares
     a hook to fire events before navigation.
     --------------------------------------------------------- */
  function initPlanTracking() {
    var planLinks = document.querySelectorAll('.plan-card a.btn');
    planLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var plan = link.getAttribute('href').replace('/', '');
        // Hook point: send analytics event here, e.g.
        // window.dataLayer && window.dataLayer.push({ event: 'select_plan', plan: plan });
        if (window.console && window.console.info) {
          console.info('[Zenvest] plano selecionado:', plan);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initAccordion();
    initDemoTabs();
    initBalanceCounter();
    initAnchorScroll();
    initPlanTracking();
  });
})();
