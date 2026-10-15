const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    mainNav.classList.toggle('open', !isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    mainNav.classList.remove('open');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      mainNav.classList.remove('open');
      menuToggle.focus();
    }
  });
}


const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(element => observer.observe(element));
} else revealElements.forEach(element => element.classList.add('is-visible'));


const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  });
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});


const themeToggle = document.getElementById('theme-toggle');
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    const light = theme === 'light';
    themeToggle.innerHTML = light ? '☾ <span>Dark mode</span>' : '☼ <span>Light mode</span>';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  }
};
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('olawuyi-portfolio-theme') || 'dark'; } catch (_) {}
applyTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('olawuyi-portfolio-theme', next); } catch (_) {}
});

const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = () => backToTop?.classList.toggle('visible', window.scrollY > 500);
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


const contact = { email: 'olawuyimuhammad60@gmail.com', whatsapp: '2348080662698', github: 'https://github.com/king009-cloud' };
const emailLink = document.getElementById('email-link');
const emailText = document.getElementById('email-text');
if (emailLink && emailText) { emailLink.href = `mailto:${contact.email}`; emailText.textContent = contact.email; }
const whatsappLink = document.getElementById('whatsapp-link');
if (whatsappLink) whatsappLink.href = `https://wa.me/${contact.whatsapp}`;
const githubLink = document.getElementById('github-link');
const githubText = document.getElementById('github-text');
if (githubLink && githubText) { githubLink.href = contact.github; githubText.textContent = contact.github.replace(/^https?:\/\//, ''); }


const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const senderEmail = String(data.get('senderEmail') || '').trim();
  const subject = String(data.get('subject') || '').trim();
  const message = String(data.get('message') || '').trim();
  const body = `Name: ${name}\nReply email: ${senderEmail}\n\nProject details:\n${message}`;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`[Portfolio enquiry] ${subject}`)}&body=${encodeURIComponent(body)}`;
  if (formFeedback) formFeedback.textContent = 'Your email app should open with the enquiry ready to review. Press Send in your email app to deliver it.';
  window.location.href = mailto;
});


(() => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const bar = loader.querySelector('.loader-progress');
  const percent = document.getElementById('loader-percent');
  const status = document.getElementById('loader-status');
  const startedAt = Date.now();
  let value = 0;
  const labels = [
    [25, 'Setting the stage'],
    [55, 'Getting things ready'],
    [82, 'Almost there'],
    [100, 'Welcome']
  ];
  const progressTimer = window.setInterval(() => {
    const cap = document.readyState === 'complete' ? 96 : 82;
    value = Math.min(cap, value + Math.max(1, Math.round((cap - value) / 8)));
    if (bar) bar.style.width = value + '%';
    if (percent) percent.textContent = value + '%';
    const current = labels.findLast ? labels.findLast(item => value >= item[0]) : labels.filter(item => value >= item[0]).pop();
    if (status && current) status.textContent = current[1];
  }, 90);

  const finishLoading = () => {
    const wait = Math.max(0, 1250 - (Date.now() - startedAt));
    window.setTimeout(() => {
      window.clearInterval(progressTimer);
      if (bar) bar.style.width = '100%';
      if (percent) percent.textContent = '100%';
      if (status) status.textContent = 'Welcome';
      window.setTimeout(() => {
        loader.classList.add('is-hidden');
        window.setTimeout(() => {
          document.body.classList.add('portfolio-ready');
          loader.remove();
        }, 750);
      }, 180);
    }, wait);
  };

  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading, { once: true });
})();
