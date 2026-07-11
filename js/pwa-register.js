// Enregistre le service worker et gère le bouton "Installer l'appli".
// À inclure sur toutes les pages (client ET admin), juste avant </body>.

// IMPORTANT : document.currentScript n'est fiable que pendant l'exécution
// synchrone initiale du script — on le capture donc tout de suite ici, PAS
// à l'intérieur d'un callback (load, DOMContentLoaded, etc.) où il serait
// déjà redevenu null.
const __pwaScriptEl = document.currentScript;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ce script est chargé depuis "js/pwa-register.js" (pages racine) ou
    // "../js/pwa-register.js" (pages dans un sous-dossier comme admin/).
    // Dans les deux cas, son URL absolue réelle permet de retrouver la
    // racine du site, même hébergé dans un sous-dossier (ex. GitHub Pages
    // "https://user.github.io/mon-depot/").
    const scriptEl = __pwaScriptEl || document.querySelector('script[src*="pwa-register.js"]');
    const scriptUrl = new URL(scriptEl.src, window.location.href);
    const siteRoot = scriptUrl.href.replace(/js\/pwa-register\.js(\?.*)?$/, '');
    const swUrl = siteRoot + 'sw.js';

    navigator.serviceWorker.register(swUrl, { scope: siteRoot }).catch((err) => {
      console.warn('Maison Sylla : service worker non enregistré.', err);
    });
  });
}

// Capture l'évènement d'installation pour proposer un bouton "Installer"
// personnalisé (au lieu de compter uniquement sur le menu du navigateur).
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.hidden = false;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.hidden = true;
});

function initInstallButton() {
  const btn = document.getElementById('installAppBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btn.hidden = true;
  });
}

document.addEventListener('DOMContentLoaded', initInstallButton);
