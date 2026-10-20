/* ===================== CONFIGURAÇÃO =====================
 * Preencha antes de publicar.
 * CHECKOUT_URL: link de pagamento (Mercado Pago, Stripe, Hotmart, Kiwify, etc.)
 * WHATSAPP_NUMBER: somente dígitos com DDI + DDD, ex.: '5511999999999'
 * ======================================================== */
const CONFIG = {
  CHECKOUT_URL: 'https://pay.cakto.com.br/fuw8nk4',
  WHATSAPP_NUMBER: '',
  WHATSAPP_MESSAGE: 'Olá! Quero saber mais sobre a análise da Scorevin.'
};

// Menu mobile
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
// (o ícone ☰ / ✕ troca sozinho pelo CSS, conforme aria-expanded)
const setMenu = open => {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Vídeo do hero: pausa para quem prefere menos movimento e quando sai da tela
const heroVideo = document.getElementById('heroVideo');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
} else {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) heroVideo.play().catch(() => {}); else heroVideo.pause();
  }).observe(heroVideo);
}

// Barra CTA mobile: aparece após o hero e some na seção de oferta
const sticky = document.getElementById('stickyCta');
const hero = document.getElementById('inicio');
const offer = document.getElementById('contratar');
let heroVisible = true, offerVisible = false;
const updateSticky = () => sticky.classList.toggle('show', !heroVisible && !offerVisible);
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; updateSticky(); }).observe(hero);
new IntersectionObserver(([e]) => { offerVisible = e.isIntersecting; updateSticky(); }, { threshold: 0.2 }).observe(offer);

// Checkout com aceite obrigatório dos termos
const consent = document.getElementById('consent');
const checkout = document.getElementById('checkout');
const msg = document.getElementById('formMsg');
consent.addEventListener('change', () => {
  checkout.disabled = !consent.checked;
  msg.textContent = '';
});
checkout.addEventListener('click', () => {
  if (!consent.checked) return;
  track('checkout_click');
  if (CONFIG.CHECKOUT_URL) {
    window.location.href = CONFIG.CHECKOUT_URL;
  } else {
    msg.textContent = 'Checkout ainda não configurado. Defina CHECKOUT_URL em script.js.';
  }
});

// WhatsApp
if (CONFIG.WHATSAPP_NUMBER) {
  const wa = document.getElementById('whatsapp');
  wa.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`;
  wa.hidden = false;
  wa.addEventListener('click', () => track('whatsapp_click'));
}

// Rastreamento de cliques (compatível com GA4 / Meta Pixel, se instalados)
function track(event) {
  if (typeof window.gtag === 'function') window.gtag('event', event);
  if (typeof window.fbq === 'function') window.fbq('trackCustom', event);
}
document.querySelectorAll('[data-track]').forEach(el =>
  el.addEventListener('click', () => track(el.dataset.track))
);



// Sombra no topo ao rolar
const topBar = document.querySelector('.top');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  const y = window.scrollY;
  topBar.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 600);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Voltar ao topo
toTop.addEventListener('click', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
});

/* ===================== MOVIMENTO =====================
 * Tudo aqui é visual. Se algo falhar, a página continua completa e visível.
 * Quem prefere menos movimento recebe a página estática.
 * ===================================================== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Entradas ao rolar (a classe .js só é ligada depois que o observador existe)
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
    root.classList.add('js');
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Menu: destaca a seção em que a pessoa está
  const navLinks = [...document.querySelectorAll('#menu a[href^="#"]:not(.btn)')];
  if ('IntersectionObserver' in window) {
    const byId = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      const link = byId.get(e.target.id);
      if (!link) return;
      if (e.isIntersecting) {
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      } else if (link.hasAttribute('aria-current')) {
        link.removeAttribute('aria-current');
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Etapas: a linha verde acompanha a leitura e acende cada etapa ao chegar nela.
  // O trilho vai do centro do 1º nó (11 px) ao centro do último, seja qual for a quantidade de etapas.
  const steps = document.querySelector('.steps');
  const stepItems = steps ? [...steps.querySelectorAll('.step')] : [];
  const NODE = 11;
  const updateSteps = () => {
    if (!steps || !stepItems.length) return;
    const r = steps.getBoundingClientRect();
    const last = stepItems[stepItems.length - 1];
    const rail = Math.max(1, last.offsetTop);
    steps.style.setProperty('--rail-end', `${Math.round(steps.offsetHeight - last.offsetTop - NODE)}px`);
    const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.7 - (r.top + NODE)) / rail));
    steps.style.setProperty('--p', p.toFixed(3));
    stepItems.forEach(it => it.classList.toggle('on', p >= 1 || p * rail >= it.offsetTop - 2));
  };

  // Peças 3D do topo: parallax leve com o mouse e com a rolagem
  const hero = document.getElementById('inicio');
  const objs = hero ? [...hero.querySelectorAll('.obj')] : [];
  let mx = 0, my = 0;
  const renderObjs = () => {
    const sy = Math.min(scrollY, innerHeight);
    objs.forEach(o => {
      const d = +o.dataset.depth || 0;
      o.style.transform = `translate3d(${(-mx * d).toFixed(1)}px, ${(-my * d - sy * d / 180).toFixed(1)}px, 0)`;
    });
  };
  if (!reduce && hero && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      queue();
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mx = 0; my = 0; queue(); });
  }

  // "Voltar ao topo" sai da frente enquanto o cartão de preço está visível (a regra só vale no celular, no CSS)
  const offerCard = document.querySelector('.offer-card');
  const toTopBtn = document.getElementById('toTop');
  if (offerCard && toTopBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => toTopBtn.classList.toggle('on-offer', e.isIntersecting)).observe(offerCard);
  }

  let ticking = false;
  const frame = () => {
    ticking = false;
    updateSteps();
    if (!reduce) renderObjs();
  };
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  frame();
})();
