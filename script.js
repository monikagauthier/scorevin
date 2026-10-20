/* ===================== CONFIGURAÇÃO =====================
 * Preencha antes de publicar.
 * CHECKOUT_URL: link de pagamento (Mercado Pago, Stripe, Hotmart, Kiwify, etc.)
 * WHATSAPP_NUMBER: somente dígitos com DDI + DDD, ex.: '5511999999999'
 * ======================================================== */
const CONFIG = {
  CHECKOUT_URL: '',
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
