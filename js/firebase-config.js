/* ==========================================================================
   MAISON SYLLA — Configuration Firebase
   ==========================================================================
   ÉTAPES POUR ACTIVER LE CATALOGUE EN DIRECT (voir README.md, section
   "Configurer Firebase" pour le détail pas-à-pas) :

   1. Créez un projet gratuit sur https://console.firebase.google.com
   2. Activez "Firestore Database" (mode production)
   3. Activez "Authentication" → méthode "E-mail/Mot de passe"
   4. Ajoutez manuellement un compte par membre de la famille dans
      Authentication → Users → "Add user" (PAS d'inscription publique sur
      le site : seuls les comptes que vous créez vous-même peuvent se
      connecter à l'espace famille).
   5. Dans les paramètres du projet (roue crantée → Paramètres du projet),
      copiez la configuration "SDK setup and configuration" et collez-la
      ci-dessous à la place des valeurs "À_REMPLACER".
   6. Dans Firestore → Règles, collez les règles de sécurité fournies dans
      le README, puis publiez.

   Tant que ce fichier n'est pas rempli, le site fonctionne quand même :
   il affiche automatiquement un catalogue de démonstration local.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "À_REMPLACER",
  authDomain: "À_REMPLACER.firebaseapp.com",
  projectId: "À_REMPLACER",
  storageBucket: "À_REMPLACER.appspot.com",
  messagingSenderId: "À_REMPLACER",
  appId: "À_REMPLACER",
};

let db = null;
let auth = null;

try {
  if (firebaseConfig.apiKey !== "À_REMPLACER") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
  } else {
    console.info("Maison Sylla : Firebase non configuré — catalogue de démonstration local utilisé. Voir js/firebase-config.js.");
  }
} catch (e) {
  console.warn("Maison Sylla : erreur d'initialisation Firebase.", e);
}
