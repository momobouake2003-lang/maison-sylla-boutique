/* ==========================================================================
   MAISON SYLLA — comportements partagés
   Panier persistant via localStorage (fonctionne une fois le site déployé
   sur Netlify/Vercel ou ouvert directement dans un navigateur).
   ========================================================================== */

const WHATSAPP_NUMBER = '2250576533996'; // Numéro WhatsApp officiel de Maison Sylla
const CART_KEY = 'maison-sylla-cart';

/* ---------- Panier ---------- */
function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveCart(cart){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
  updateCartBadge();
}
function addToCart(id, qty){
  qty = qty || 1;
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(line){ line.qty += qty; } else { cart.push({ id, qty }); }
  saveCart(cart);
}
function removeFromCart(id){
  saveCart(getCart().filter(l => l.id !== id));
}
function setQty(id, qty){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(!line) return;
  line.qty = Math.max(1, qty);
  saveCart(cart);
}
function cartLinesWithProducts(){
  return getCart().map(l => ({ ...l, product: getProduct(l.id) })).filter(l => l.product);
}
function cartCount(){
  return getCart().reduce((n, l) => n + l.qty, 0);
}
function cartTotal(){
  return cartLinesWithProducts().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}
function updateCartBadge(){
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? 'inline-flex' : 'none';
  });
}

/* ---------- Toast ---------- */
function showToast(msg){
  let el = document.querySelector('.toast');
  if(!el){
    el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="dot"></span><span class="msg"></span>';
    document.body.appendChild(el);
  }
  el.querySelector('.msg').textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ---------- WhatsApp ---------- */
function whatsappLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function whatsappProductMessage(product){
  return `Bonjour Maison Sylla, je suis intéressé(e) par : ${product.name} (${formatFCFA(product.price)}). Est-il disponible ?`;
}
function whatsappCartMessage(){
  const lines = cartLinesWithProducts();
  if(lines.length === 0) return "Bonjour Maison Sylla, j'aimerais passer une commande.";
  let msg = "Bonjour Maison Sylla, je souhaite commander :\n";
  lines.forEach(l => { msg += `- ${l.product.name} x${l.qty} (${formatFCFA(l.product.price * l.qty)})\n`; });
  msg += `Total : ${formatFCFA(cartTotal())}`;
  return msg;
}

/* ---------- Icônes utilitaires ---------- */
const UI_ICONS = {
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 2.5h3l2.7 13.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 6.5H6.2"/></svg>`,
  whatsapp: `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 3C9.4 3 4 8.36 4 15c0 2.4.7 4.63 1.9 6.5L4 29l7.7-1.85A11.9 11.9 0 0 0 16.02 27C22.64 27 28 21.64 28 15S22.64 3 16.02 3zm0 21.6c-2 0-3.9-.55-5.5-1.5l-.4-.24-4.6 1.1 1.13-4.48-.26-.42A9.5 9.5 0 1 1 25.5 15c0 5.3-4.28 9.6-9.48 9.6zm5.4-7.16c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.06 2.87 1.2 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>`,
  empty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 2.5h3l2.7 13.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 6.5H6.2"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h13v13H1zM14 8h4l4 4v4h-8V8z"/><circle cx="6.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2L8 10a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2z"/></svg>`,
};

/* ---------- Marque (logo) ---------- */
const BRAND_MARK = `<svg viewBox="0 0 48 48" fill="none"><rect x="2" y="2" width="44" height="44" rx="4" fill="#1B2A4A"/><path d="M10 34V14l14 14 14-14v20" stroke="#E0B658" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 40h36" stroke="#C89B3C" stroke-width="2.6" stroke-linecap="round"/></svg>`;

/* ---------- Header / Footer injection ---------- */
function siteHeader(active){
  const link = (href, label, key) => `<a href="${href}" class="${active===key?'active':''}">${label}</a>`;
  return `
  <div class="announce">Livraison à Bouaké &amp; environs · <b>Paiement Mobile Money accepté</b> · Commande rapide via WhatsApp</div>
  <div class="wrap nav-row">
    <a href="index.html" class="brand">
      <span class="brand-mark">${BRAND_MARK}</span>
      <span class="brand-text"><span class="name">Maison Sylla</span><span class="tag">Excellence Garantie</span></span>
    </a>
    <nav class="main-nav" id="mainNav">
      ${link('index.html', 'Accueil', 'accueil')}
      ${link('electronique.html', 'Électronique', 'electronique')}
      ${link('vaisselle.html', 'Vaisselle', 'vaisselle')}
      ${link('gourdes.html', 'Gourdes', 'gourdes')}
      ${link('contact.html', 'Contact', 'contact')}
    </nav>
    <div class="nav-actions">
      <a href="panier.html" class="cart-btn">
        ${UI_ICONS.cart}<span>Panier</span>
        <span class="cart-count" data-cart-count>0</span>
      </a>
      <button class="burger" id="burgerBtn" aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1B2A4A" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
  <div class="ruban"></div>`;
}

function siteFooter(){
  return `
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="name">Maison Sylla</span>
        <p>Une maison familiale de Bouaké qui prolonge le savoir-faire de Sylla Tissus vers l'électroménager, la vaisselle et les articles du quotidien — avec la même exigence de qualité.</p>
      </div>
      <div class="footer-col">
        <h5>Boutique</h5>
        <a href="electronique.html">Électronique</a>
        <a href="vaisselle.html">Vaisselle</a>
        <a href="gourdes.html">Gourdes &amp; drinkware</a>
        <a href="panier.html">Mon panier</a>
      </div>
      <div class="footer-col">
        <h5>Maison Sylla</h5>
        <a href="index.html#apropos">Notre histoire</a>
        <a href="contact.html">Contact</a>
        <a href="${whatsappLink('Bonjour Maison Sylla, j\'ai une question.')}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="admin.html">Espace famille</a>
      </div>
      <div class="footer-col">
        <h5>Paiement</h5>
        <p>Orange Money · MTN Money · Wave</p>
        <p>Carte bancaire (via CinetPay)</p>
        <p>Paiement à la livraison possible</p>
      </div>
    </div>
    <div class="ruban thin"></div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Maison Sylla — Bouaké, Côte d'Ivoire</span>
      <span>Fait avec soin pour la famille Sylla</span>
    </div>
  </div>`;
}

function mountHeaderFooter(active){
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if(h) h.innerHTML = siteHeader(active);
  if(f) f.innerHTML = siteFooter();

  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  if(burger && nav){
    burger.addEventListener('click', () => nav.classList.toggle('open'));
  }
  updateCartBadge();

  // Floating WhatsApp button (present on every page)
  if(!document.querySelector('.wa-float')){
    const a = document.createElement('a');
    a.className = 'wa-float';
    a.href = whatsappLink("Bonjour Maison Sylla, j'ai une question sur vos produits.");
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Contacter sur WhatsApp');
    a.innerHTML = UI_ICONS.whatsapp;
    document.body.appendChild(a);
  }
}

document.addEventListener('DOMContentLoaded', () => updateCartBadge());
