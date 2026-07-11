// Maison Sylla — enregistrement du service worker + bouton d'installation PWA.
// Ce script est chargé sur toutes les pages (boutique ET admin.html) juste
// avant </body>. Il ne fait rien si le navigateur ne supporte pas les PWA.

(function () {
  // ---------- 1. Enregistrer le service worker ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('Maison Sylla : échec d\'enregistrement du service worker.', err);
      });
    });
  }

  // ---------- 2. Gérer le bouton "Installer l'appli" (s'il existe sur la page) ----------
  let deferredPrompt = null;
  const installBtn = document.getElementById('installAppBtn');

  window.addEventListener('beforeinstallprompt', (event) => {
    // Empêche la mini-infobar automatique de Chrome pour proposer notre propre bouton
    event.preventDefault();
    deferredPrompt = event;
    if (installBtn) installBtn.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installBtn.hidden = true;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }

  // Une fois l'appli installée, on cache définitivement le bouton
  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.hidden = true;
    deferredPrompt = null;
  });
})();
