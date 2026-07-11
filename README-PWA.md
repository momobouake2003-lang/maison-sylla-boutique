# Maison Sylla — 2 applications installables (PWA)

Ce dossier ajoute à ton site existant **deux applications installables**,
sans app store, sans Capacitor, sans build :

- **Maison Sylla** (icône dorée "MS") → l'appli **clients** : accueil,
  catégories, panier, contact.
- **MS Admin** (icône verte "MS") → l'appli **famille** : `admin.html`
  uniquement, pour gérer le catalogue et les commandes.

Un visiteur qui ouvre ton site sur son téléphone verra une bannière ou un
bouton "Ajouter à l'écran d'accueil" (Chrome/Android) ou pourra utiliser
"Sur l'écran d'accueil" depuis le menu de partage (Safari/iOS). Une fois
installée, l'appli s'ouvre en plein écran, avec sa propre icône, sans barre
d'adresse — exactement comme une appli native.

## Comment fusionner ça avec ton site actuel

Ce dossier contient uniquement les nouveaux fichiers PWA + tes pages HTML
déjà modifiées. Il ne contient **pas** `css/style.css`,
`js/products.js`, `js/cart.js`, `js/firebase-config.js` (je ne les ai pas
reçus). Pour déployer :

1. Copie tout le contenu de ce dossier **par-dessus** ton dossier de site
   actuel (les 8 fichiers `.html` remplacent les anciens, `manifest-*.json`,
   `sw.js`, `icons/`, `js/pwa-register.js` sont de nouveaux fichiers).
2. Vérifie que ton dossier `js/` garde bien `products.js`, `cart.js`,
   `firebase-config.js` en plus du nouveau `pwa-register.js`.
3. Redéploie sur Netlify/Vercel comme d'habitude.

## Fichiers ajoutés

```
manifest-client.json   Identité de l'appli "Maison Sylla" (clients)
manifest-admin.json    Identité de l'appli "MS Admin" (famille)
sw.js                  Service worker (cache CSS/JS, accès hors-ligne partiel)
js/pwa-register.js     Enregistre le service worker + gère le bouton d'install
icons/                 Icônes 192px et 512px pour les deux apps (placeholder "MS")
```

Chaque page `.html` a reçu dans son `<head>` un lien vers le bon manifest
(`manifest-client.json` pour les pages boutique, `manifest-admin.json` pour
`admin.html`), et juste avant `</body>` un appel à `js/pwa-register.js`.

## L'appli admin a déménagé vers `/admin/`

Pour que Chrome/Android traite l'appli client et l'appli admin comme deux
applis vraiment séparées et n'installe pas l'une par-dessus l'autre, l'admin
vit maintenant dans son propre dossier : `admin/index.html` (au lieu de
`admin.html` à la racine). L'ancien fichier `admin.html` a été gardé comme
simple redirection automatique vers `/admin/`, pour que tes anciens favoris
continuent de fonctionner.

**Nouvelle URL à utiliser pour te connecter et pour installer l'appli
famille : `https://tonsite.com/admin/`** (avec le slash à la fin).

## Important : HTTPS obligatoire

Les PWA ne fonctionnent **que sur HTTPS** (ou en local via `localhost`).
Netlify et Vercel fournissent HTTPS automatiquement — donc aucun souci une
fois déployé.

## Remplacer les icônes provisoires

Les icônes actuelles sont un simple monogramme "MS" généré automatiquement
dans tes couleurs (or `#C89B3C` / vert `#2F5233`). Pour utiliser ton vrai
logo Sylla :
1. Prépare 2 images carrées **PNG**, fond plein (pas transparent), en 192×192
   et 512×512 px — une version pour l'appli client, une pour l'admin (ou la
   même pour les deux si tu préfères une seule identité visuelle).
2. Remplace les fichiers dans `icons/` en gardant exactement les mêmes noms
   (`client-icon-192.png`, `client-icon-512.png`, etc.).
3. Pour les versions "maskable" (`-maskable.png`), laisse ~10% de marge
   autour du logo : certains téléphones Android découpent l'icône en cercle
   ou en carré arrondi et rognent les bords.

## Ajouter un vrai bouton "Installer l'appli" (optionnel)

Le script `pwa-register.js` sait déjà gérer un bouton — il suffit d'ajouter
quelque part dans ton header (ex. dans le header de `index.html` ou dans le
composant injecté par `mountHeaderFooter`) :

```html
<button id="installAppBtn" hidden class="btn btn-gold">Installer l'appli</button>
```

Le bouton reste caché tant que le navigateur n'a pas proposé l'installation,
puis apparaît automatiquement et déclenche l'invite native au clic.

## Tester avant de partager

1. Déploie sur Netlify/Vercel (ou teste en local avec `npx serve`).
2. Ouvre le site sur un téléphone Android avec Chrome → menu ⋮ → "Installer
   l'application" (ou attends la bannière automatique).
3. Sur iPhone avec Safari → bouton Partager → "Sur l'écran d'accueil".
4. Vérifie que `admin.html` s'installe séparément avec l'icône verte "MS
   Admin" — c'est une appli distincte de la boutique cliente.

## Limites à connaître

- Ce n'est pas une appli sur le Play Store / App Store — c'est une PWA
  installable directement depuis le navigateur. C'est suffisant pour un
  usage interne famille + clients locaux, sans les délais et frais de
  publication sur un store.
- Le panier reste basé sur `localStorage` (comme avant) : il fonctionne bien
  une fois l'appli installée, mais reste propre à chaque téléphone.
- Si tu veux un jour publier sur le Play Store, ce même code PWA peut être
  encapsulé avec **Capacitor** en quelques heures — la base que je viens de
  créer est déjà compatible avec cette évolution.
