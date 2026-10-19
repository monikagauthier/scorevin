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
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? '✕' : '☰';
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = '☰';
}));

// Animações de entrada ao rolar
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.id === 'progress' || e.target.querySelector('#progress')) {
        document.getElementById('progress').classList.add('on');
      }
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

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
