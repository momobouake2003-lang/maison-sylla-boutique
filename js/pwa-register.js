// Enregistre le service worker et gère le bouton "Installer l'appli".
// À inclure sur toutes les pages (client ET admin), juste avant </body>.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
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
