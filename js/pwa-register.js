// Maison Sylla — service worker + bannière d'installation.
// À inclure sur toutes les pages (client ET admin), juste avant </body>.
// Ne nécessite AUCUNE modification du HTML : la bannière s'injecte toute
// seule en bas de l'écran quand l'appli est installable.

// IMPORTANT : document.currentScript n'est fiable que pendant l'exécution
// synchrone initiale du script — on le capture donc tout de suite ici, PAS
// à l'intérieur d'un callback (load, DOMContentLoaded, etc.) où il serait
// déjà redevenu null.
const __pwaScriptEl = document.currentScript;

function __pwaSiteRoot() {
  const scriptEl = __pwaScriptEl || document.querySelector('script[src*="pwa-register.js"]');
  const scriptUrl = new URL(scriptEl.src, window.location.href);
  return scriptUrl.href.replace(/js\/pwa-register\.js(\?.*)?$/, '');
}

// ---------- Enregistrement du service worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const siteRoot = __pwaSiteRoot();
    navigator.serviceWorker.register(siteRoot + 'sw.js', { scope: siteRoot }).catch((err) => {
      console.warn('Maison Sylla : service worker non enregistré.', err);
    });
  });
}

// ---------- Bannière d'installation ----------
(function () {
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  if (isStandalone()) return; // déjà installée : rien à afficher

  const isAdmin = location.pathname.includes('/admin/');
  const appLabel = isAdmin ? "l'espace famille Maison Sylla" : 'Maison Sylla';
  const accent = isAdmin ? '#2F5233' : '#C89B3C';
  const storageKey = isAdmin ? 'ms_install_dismissed_admin' : 'ms_install_dismissed_app';
  const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

  function dismissedRecently() {
    const t = localStorage.getItem(storageKey);
    return !!t && (Date.now() - parseInt(t, 10)) < SEVEN_DAYS;
  }

  let deferredInstallPrompt = null;
  let bannerEl = null;

  function removeBanner() {
    if (bannerEl) { bannerEl.remove(); bannerEl = null; }
  }

  function showBanner({ isIOS }) {
    if (dismissedRecently() || bannerEl) return;

    bannerEl = document.createElement('div');
    bannerEl.id = 'ms-install-banner';
    bannerEl.innerHTML = `
      <style>
        #ms-install-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;
          background:#1B2A4A;color:#F7F3EA;padding:14px 16px;
          display:flex;align-items:center;gap:12px;
          box-shadow:0 -2px 16px rgba(0,0,0,.28);
          font-family:inherit;animation:ms-slide-up .3s ease;}
        @keyframes ms-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
        #ms-install-banner p{margin:0;font-size:.86rem;line-height:1.35;flex:1;}
        #ms-install-banner .ms-install-btn{background:${accent};color:#1B2A4A;border:none;
          padding:9px 16px;border-radius:5px;font-weight:700;font-size:.85rem;
          cursor:pointer;white-space:nowrap;flex-shrink:0;}
        #ms-install-banner .ms-close-btn{background:none;border:none;color:#F7F3EA;
          opacity:.65;font-size:1.15rem;line-height:1;cursor:pointer;padding:4px 6px;flex-shrink:0;}
        @media (min-width:640px){#ms-install-banner{left:auto;right:20px;bottom:20px;
          max-width:380px;border-radius:10px;}}
      </style>
      <p>${isIOS
        ? `Installez ${appLabel} : appuyez sur <b>Partager</b> puis « <b>Sur l'écran d'accueil</b> ».`
        : `Installez ${appLabel} sur cet appareil pour un accès plus rapide.`}</p>
      ${isIOS ? '' : '<button type="button" class="ms-install-btn">Installer</button>'}
      <button type="button" class="ms-close-btn" aria-label="Fermer">✕</button>
    `;
    document.body.appendChild(bannerEl);

    if (!isIOS) {
      bannerEl.querySelector('.ms-install-btn').addEventListener('click', async () => {
        removeBanner();
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
      });
    }
    bannerEl.querySelector('.ms-close-btn').addEventListener('click', () => {
      localStorage.setItem(storageKey, Date.now().toString());
      removeBanner();
    });
  }

  // Android / Chrome / Edge : évènement natif d'installation
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showBanner({ isIOS: false });
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    removeBanner();
    localStorage.removeItem(storageKey);
  });

  // iOS Safari : aucun évènement natif n'existe, on explique la manip après un court délai
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
  const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua);
  if (isIOSDevice && isSafari) {
    window.addEventListener('load', () => setTimeout(() => showBanner({ isIOS: true }), 1800));
  }
})();
