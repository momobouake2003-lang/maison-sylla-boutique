# Maison Sylla — site vitrine & panier

Site HTML/CSS/JS (sans framework), prêt à héberger sur **Netlify** ou **Vercel**.
Le catalogue produits est géré **en direct via Firebase** : n'importe quel
membre de la famille ayant un compte peut ajouter, modifier ou supprimer un
produit depuis `admin.html`, et le changement apparaît immédiatement pour
tous les visiteurs — sans republier le site.

## Structure
```
index.html          Page d'accueil
electronique.html    Catégorie Électronique
vaisselle.html        Catégorie Vaisselle
gourdes.html           Catégorie Gourdes & Drinkware
produit.html            Fiche produit (utilise ?id=... par ex.)
panier.html              Panier + formulaire de commande
contact.html             Coordonnées, réseaux, WhatsApp
admin.html               Espace famille : connexion + gestion du catalogue
css/style.css            Feuille de style (design system complet)
js/products.js           Icônes, catégories, chargement du catalogue (Firestore + repli local)
js/firebase-config.js    Clés de connexion à votre projet Firebase (à remplir)
js/cart.js                Panier (localStorage), en-tête/pied de page, WhatsApp
```

## Configurer Firebase (nécessaire pour l'espace famille)

Le site fonctionne déjà tel quel avec un catalogue de démonstration local.
Pour activer la gestion en direct par la famille, il faut créer un projet
Firebase gratuit (aucune carte bancaire requise pour ce niveau d'usage) :

1. **Créer le projet** — allez sur [console.firebase.google.com](https://console.firebase.google.com), cliquez sur « Ajouter un projet » et suivez les étapes (le plan gratuit "Spark" suffit largement).

2. **Activer Firestore** — dans le menu de gauche, « Firestore Database » → « Créer une base de données » → mode production → choisissez une région proche (ex. `eur3` ou `europe-west`).

3. **Activer l'authentification** — menu « Authentication » → « Get started » → onglet « Sign-in method » → activez **E-mail/Mot de passe**.

4. **Créer un compte par membre de la famille** — toujours dans « Authentication » → onglet « Users » → « Add user ». Entrez un e-mail et un mot de passe pour chaque personne autorisée à gérer le catalogue. **Il n'y a pas d'inscription publique sur le site** : seuls les comptes que vous créez ici peuvent se connecter à `admin.html`.

5. **Récupérer la configuration** — icône ⚙️ (Paramètres du projet) → en bas, section « Vos applications » → cliquez sur l'icône `</>` pour ajouter une application web → donnez-lui un nom (ex. "Maison Sylla") → copiez l'objet `firebaseConfig` affiché.

6. **Coller la configuration** — ouvrez `js/firebase-config.js` et remplacez les valeurs `"À_REMPLACER"` par celles copiées à l'étape précédente.

7. **Définir les règles de sécurité** — dans Firestore → onglet « Règles », remplacez le contenu par :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /products/{productId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /orders/{orderId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```
   Cliquez sur « Publier ». Cela veut dire :
   - **Produits** : tout le monde peut *voir* le catalogue, mais seule une
     personne *connectée* (un membre de la famille) peut en ajouter,
     modifier ou supprimer.
   - **Commandes** : n'importe quel visiteur peut *créer* une commande en
     validant son panier (pas besoin de compte pour commander), mais seule
     une personne connectée peut *consulter* l'historique des commandes
     dans `admin.html` — un client ne peut donc jamais voir les commandes
     des autres.

8. **Déployez le site** (voir plus bas) puis ouvrez `admin.html`, connectez-vous avec un des comptes créés à l'étape 4, et cliquez sur « Importer le catalogue de démonstration » pour démarrer avec les 18 produits actuels — modifiables ensuite librement.

## Utiliser l'espace famille au quotidien

- Ouvrez `motre-site.com/admin.html`, connectez-vous.
- **Ajouter un produit** : remplissez le formulaire (nom, catégorie, prix, icône ou URL d'image, description, disponibilité) puis « Ajouter le produit ». Il apparaît instantanément sur le site public.
- **Modifier** : cliquez sur « Modifier » à côté d'un produit dans la liste, changez ce qui doit l'être, puis « Mettre à jour ».
- **Supprimer** : cliquez sur « Supprimer » (une confirmation est demandée).
- Plusieurs membres de la famille peuvent se connecter en même temps, depuis n'importe quel appareil (téléphone, ordinateur).

## Personnaliser rapidement

1. **Numéro WhatsApp** — dans `js/cart.js`, tout en haut :
   ```js
   const WHATSAPP_NUMBER = '2250576533996';
   ```
   Remplacez par le vrai numéro (indicatif pays sans le +, sans espaces).

2. **Produits** — une fois Firebase configuré (voir plus bas), gérez les
   produits directement depuis `admin.html`, sans toucher au code. Le
   tableau `SEED_PRODUCTS` dans `js/products.js` ne sert que de catalogue de
   démonstration/repli tant que Firestore n'est pas configuré ou est vide.
   Pour utiliser une vraie photo plutôt qu'une icône dessinée, renseignez le
   champ « URL d'image » dans le formulaire d'ajout/modification (image
   hébergée n'importe où : Imgur, Google Drive en partage public, etc.).

3. **Coordonnées** — adresse, horaires et réseaux sociaux dans `contact.html`.

4. **Couleurs / typographie** — tout est piloté par les variables CSS en haut
   de `css/style.css` (section `:root`).

## Paiement en ligne (étape suivante)

Le site est prêt à intégrer un agrégateur comme **CinetPay** (Orange Money,
MTN Money, Moov Money, carte bancaire) ou **Wave** :

1. Créez un compte marchand chez [CinetPay](https://cinetpay.com) ou [Wave Business](https://wave.com).
2. Sur la page `panier.html`, remplacez la soumission du formulaire
   (actuellement un lien WhatsApp) par un appel à leur API de paiement,
   en suivant leur documentation d'intégration JavaScript/HTML.
3. En attendant cette intégration, le site utilise WhatsApp comme méthode de
   commande — ce qui est courant et efficace en Côte d'Ivoire.

## Panier et données

Le panier utilise `localStorage` du navigateur : il persiste entre les pages
et les visites sur un même appareil, une fois le site déployé en ligne (ou
ouvert directement dans un navigateur). Il ne fonctionne pas dans certains
aperçus intégrés en environnement de chat — testez toujours sur le lien de
déploiement Netlify/Vercel final.

## Déploiement gratuit

**Netlify (glisser-déposer) :**
1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez le dossier `maison-sylla` complet
3. Votre site est en ligne en quelques secondes

**Vercel :**
1. Créez un compte sur [vercel.com](https://vercel.com)
2. `Add New Project` → importez le dossier (ou un dépôt GitHub contenant ces fichiers)
3. Aucune configuration de build nécessaire (site statique)

## Prochaines évolutions suggérées

- Remplacer les icônes SVG par de vraies photos produits
- Ajouter un vrai backend (Node/Express + base de données) pour gérer les
  stocks et les commandes automatiquement plutôt que via WhatsApp
- Intégrer CinetPay ou Wave pour un paiement en ligne complet
- Ajouter une page « Suivi de commande »
