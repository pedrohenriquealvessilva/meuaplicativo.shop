/* =========================================================
   ORAL CLIN CAMPINAS — SCRIPT.JS
   - Header sticky ao rolar
   - Menu mobile (hambúrguer)
   - FAQ accordion
   - Reveal on scroll (fade-in)
   - Ano dinâmico no footer
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- HEADER STICKY ---------- */
  var header = document.getElementById('siteHeader');
  function updateHeaderState() {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- MENU MOBILE ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-menu"/></svg>';
  }

  function openMenu() {
    mobileNav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-close"/></svg>';
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.contains('is-open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  /* Fecha o menu mobile ao clicar em qualquer link interno */
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- FAQ ACCORDION ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      /* Fecha os outros itens abertos (accordion clássico) */
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback: navegadores sem suporte apenas exibem o conteúdo */
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- ANO DINÂMICO NO FOOTER ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

});
