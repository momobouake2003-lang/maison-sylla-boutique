/* ==========================================================================
   MAISON SYLLA — catalogue produits
   Le catalogue "en vrai" vit dans Firestore (collection "products") une
   fois Firebase configuré (voir js/firebase-config.js). Tant que ce n'est
   pas fait, ou si la connexion échoue, le site affiche automatiquement le
   catalogue de démonstration ci-dessous (SEED_PRODUCTS) pour ne jamais
   afficher une boutique vide.
   ========================================================================== */

const ICONS = {
  fer: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 40c0-10 8-20 24-20 10 0 16 5 18 10l2 4-4 2H14z"/><circle cx="40" cy="26" r="2" fill="currentColor" stroke="none"/><path d="M20 40v6M34 40v6M8 46h34"/></svg>`,
  mixeur: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h20l-4 26H26z"/><path d="M20 38h24l3 8a4 4 0 0 1-4 6H21a4 4 0 0 1-4-6z"/><path d="M28 12V8h8v4M30 20l4 6M34 20l-4 6"/></svg>`,
  ventilateur: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="26" r="3" fill="currentColor" stroke="none"/><path d="M32 26c0-8 6-14 12-12 2 6-2 12-12 12zM32 26c-8 0-14-6-12-12 6-2 12 2 12 12zM32 26c4 7 2 15-6 18-4-5-2-13 6-18z"/><circle cx="32" cy="26" r="13"/><path d="M32 40v14M22 54h20"/></svg>`,
  lampe: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="10" width="12" height="18" rx="2"/><path d="M16 14h12M16 18h12M16 22h12"/><circle cx="40" cy="34" r="10"/><path d="M40 44v6M34 54h12M36 30l8 8M44 30l-8 8"/></svg>`,
  radio: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="22" width="44" height="26" rx="3"/><circle cx="22" cy="35" r="6"/><path d="M36 30h10M36 36h10M36 42h6"/><path d="M18 22l6-10h16l6 10"/></svg>`,
  multiprise: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="24" width="48" height="16" rx="8"/><circle cx="20" cy="32" r="2.4" fill="currentColor" stroke="none"/><circle cx="32" cy="32" r="2.4" fill="currentColor" stroke="none"/><circle cx="44" cy="32" r="2.4" fill="currentColor" stroke="none"/><path d="M4 32h4M56 32h4"/></svg>`,

  assiette: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="12"/></svg>`,
  verre: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10h24l-4 30a8 8 0 0 1-16 0z"/><path d="M26 48h12M32 48v6"/></svg>`,
  theiere: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 32c0-6 6-8 14-8h6c8 0 14 4 14 10s-8 10-17 10-17-6-17-12z"/><path d="M46 28c6-2 10 1 10 5s-4 6-9 6"/><path d="M20 24v-6c0-2 2-4 5-4M32 24v-8"/></svg>`,
  plat: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="32" cy="32" rx="26" ry="12"/><ellipse cx="32" cy="32" rx="14" ry="6"/></svg>`,
  saladier: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26h44c-2 12-10 20-22 20S12 38 10 26z"/><ellipse cx="32" cy="26" rx="22" ry="6"/></svg>`,
  couverts: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8v20M22 8v20M18 28c0 4 2 6 4 6v22"/><path d="M40 8c-4 0-6 4-6 10s2 10 6 10v26"/></svg>`,

  gourdeinox: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="8" width="10" height="8" rx="2"/><path d="M18 20c0-2 2-4 4-4h10c2 0 4 2 4 4v30a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6z"/><path d="M18 32h18"/></svg>`,
  thermos: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="8" width="16" height="10" rx="2"/><path d="M18 22c0-3 2-4 4-4h20c2 0 4 1 4 4v28a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z"/><path d="M18 30h28"/></svg>`,
  bouteilleverre: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6h8v10l4 6v30a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V22l4-6z"/><path d="M22 34h20"/></svg>`,
  mugisotherme: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="14" width="26" height="36" rx="4"/><path d="M42 24h6a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-6"/><path d="M22 8h14"/></svg>`,
  gourdesport: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 10h12l2 8-4 4v28a4 4 0 0 1-4 4a4 4 0 0 1-4-4V22l-4-4z"/><path d="M22 34h20"/></svg>`,
  lotgourdes: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14h8v6l3 3v22a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3V23l3-3z"/><path d="M34 10h10v7l3 3v26a3 3 0 0 1-3 3H34a3 3 0 0 1-3-3V20l3-3z"/></svg>`,

  boite: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20l24-10 24 10-24 10z"/><path d="M8 20v24l24 10 24-10V20"/><path d="M32 30v24"/></svg>`,

  balai: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M38 6L20 40"/><path d="M14 46l10-12 8 4-8 14z"/><path d="M14 46l-4 10M20 44l-2 10M27 42l1 10"/></svg>`,
  seau: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 24h36l-4 30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M14 24c0-4 8-6 18-6s18 2 18 6"/><path d="M20 18c0-6 5-10 12-10s12 4 12 10"/></svg>`,
  panierlinge: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26h44l-5 26a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z"/><path d="M10 26c8-4 36-4 44 0"/><path d="M22 26l3-10M42 26l-3-10M32 26v-12"/></svg>`,
  eponge: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="20" width="44" height="22" rx="6"/><path d="M18 28h4M28 28h4M38 28h4M18 34h4M28 34h4M38 34h4"/></svg>`,
  rangement: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="12" width="44" height="40" rx="3"/><path d="M10 32h44M26 12v40M42 12v20"/><circle cx="34" cy="26" r="1.6" fill="currentColor" stroke="none"/><circle cx="18" cy="42" r="1.6" fill="currentColor" stroke="none"/></svg>`,

  chemise: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8l8 6 8-6 10 8-6 8-4-3v33a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V21l-4 3-6-8z"/><path d="M32 14v6"/></svg>`,
  robe: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 8h12l3 10-5 4 8 30H20l8-30-5-4z"/><path d="M26 8c0 4 2.5 6 6 6s6-2 6-6"/></svg>`,
  pantalon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8h24l2 12-4 32h-8l-2-24-2 24h-8l-4-32z"/><path d="M20 8v6h24V8"/></svg>`,
  basket: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40c0-6 4-8 10-10l6-8 8 4 8-4 8 6c6 1 8 5 8 12z"/><path d="M8 40h40v6a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z"/><path d="M22 22v10M32 26v8"/></svg>`,
  sac: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="24" width="40" height="30" rx="4"/><path d="M22 24v-6a10 10 0 0 1 20 0v6"/></svg>`,
  boubou: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8l10 6 10-6 6 12-8 6 6 32H18l6-32-8-6z"/><path d="M22 8c2 5 5 8 10 8s8-3 10-8"/></svg>`,
};

const CATEGORIES = {
  electronique: { label: 'Électronique', slug: 'electronique', desc: "Téléphones, ordinateurs et petit électroménager fiable pour la maison.", icon: ICONS.ventilateur },
  menager:      { label: 'Articles ménagers', slug: 'menager', desc: "Vaisselle, gourdes, entretien et rangement — tout pour la maison, classé par matériau.", icon: ICONS.seau },
  habillement:  { label: 'Habillement', slug: 'habillement', desc: "Vêtements et accessoires pour homme et femme, sélectionnés avec soin.", icon: ICONS.chemise },
};

/* Icônes proposées à l'admin pour chaque catégorie (voir admin/index.html) */
const ICON_CHOICES = {
  electronique: ['fer','mixeur','ventilateur','lampe','radio','multiprise','boite'],
  menager:      ['assiette','verre','theiere','plat','saladier','couverts','gourdeinox','thermos','bouteilleverre','mugisotherme','gourdesport','lotgourdes','balai','seau','panierlinge','eponge','rangement','boite'],
  habillement:  ['chemise','robe','pantalon','basket','sac','boubou','boite'],
};

/* Classification par matériau — catégorie "Articles ménagers" */
const MATERIAUX = {
  verre:      'Verre',
  porcelaine: 'Porcelaine & céramique',
  inox:       'Inox',
  plastique:  'Plastique',
  caoutchouc: 'Caoutchouc',
  metal:      'Fer & métal',
  bois:       'Bois',
  autre:      'Autre',
};

/* Classification par type — catégorie "Électronique" */
const TYPES_ELEC = {
  telephone:      'Téléphones',
  ordinateur:     'Ordinateurs',
  electromenager: 'Électroménager',
  audio:          'Audio & Radio',
  accessoire:     'Accessoires électriques',
};

/* Classification par tissu — catégorie "Habillement" */
const TISSUS = {
  coton:       'Coton',
  wax:         'Wax',
  bazin:       'Bazin',
  soie:        'Soie',
  jean:        'Jean / Denim',
  synthetique: 'Synthétique',
  cuir:        'Cuir / Simili-cuir',
  autre:       'Autre',
};

/* ---------- Catalogue de démonstration (repli si Firestore est vide/indisponible) ---------- */
const SEED_PRODUCTS = [
  { id: 'elec-01', cat: 'electronique', souscat: 'electromenager', name: 'Fer à repasser vapeur Pro', price: 15000, stock: true, iconKey: 'fer',
    desc: "Fer à repasser vapeur avec semelle anti-adhésive et réservoir d'eau amovible. Idéal pour un repassage rapide et net, y compris sur les tissus délicats." },
  { id: 'elec-02', cat: 'electronique', souscat: 'electromenager', name: 'Mixeur blender 3 vitesses', price: 22000, stock: true, iconKey: 'mixeur',
    desc: "Blender robuste 1,5L, lames en inox, 3 vitesses. Parfait pour jus, sauces et attiéké maison." },
  { id: 'elec-03', cat: 'electronique', souscat: 'electromenager', name: 'Ventilateur sur pied 16"', price: 28000, stock: true, iconKey: 'ventilateur',
    desc: "Ventilateur oscillant sur pied, hauteur réglable, 3 vitesses. Une valeur sûre pour la saison chaude." },
  { id: 'elec-04', cat: 'electronique', souscat: 'accessoire', name: 'Lampe solaire rechargeable', price: 9000, stock: true, iconKey: 'lampe',
    desc: "Lampe LED avec panneau solaire intégré et batterie rechargeable. Autonomie longue durée, idéale en cas de coupure." },
  { id: 'elec-05', cat: 'electronique', souscat: 'audio', name: 'Radio portable AM/FM', price: 12500, stock: false, iconKey: 'radio',
    desc: "Radio compacte avec grand haut-parleur, fonctionne sur secteur ou piles. Réception claire en toute circonstance." },
  { id: 'elec-06', cat: 'electronique', souscat: 'accessoire', name: 'Multiprise parafoudre 4 ports', price: 7500, stock: true, iconKey: 'multiprise',
    desc: "Multiprise avec protection contre les surtensions, câble 2 mètres. Sécurise vos appareils électroniques." },
  { id: 'elec-07', cat: 'electronique', souscat: 'telephone', name: 'Smartphone Android 4G 64Go', price: 65000, stock: true, iconKey: 'boite',
    desc: "Smartphone double SIM, 64Go de stockage, écran 6.5\". Garantie boutique, sous blister." },
  { id: 'elec-08', cat: 'electronique', souscat: 'ordinateur', name: 'Ordinateur portable Core i3', price: 185000, stock: true, iconKey: 'boite',
    desc: "PC portable 14 pouces, 8Go RAM, 256Go SSD. Idéal bureautique et usage quotidien." },

  { id: 'vai-01', cat: 'menager', matiere: 'porcelaine', name: "Service de table 12 pièces", price: 32000, stock: true, iconKey: 'assiette',
    desc: "Service complet en porcelaine blanche : assiettes plates, creuses et à dessert. Élégance sobre pour toutes les tables." },
  { id: 'vai-02', cat: 'menager', matiere: 'verre', name: 'Lot de 6 verres à eau', price: 9500, stock: true, iconKey: 'verre',
    desc: "Verres en verre trempé résistant, design classique. Vendus par lot de six." },
  { id: 'vai-03', cat: 'menager', matiere: 'porcelaine', name: 'Théière en porcelaine 1L', price: 11000, stock: true, iconKey: 'theiere',
    desc: "Théière élégante à motifs discrets, capacité 1 litre, avec filtre intégré." },
  { id: 'vai-04', cat: 'menager', matiere: 'porcelaine', name: 'Plat de service ovale', price: 8500, stock: true, iconKey: 'plat',
    desc: "Grand plat ovale en céramique, parfait pour riz, poisson ou viande en sauce." },
  { id: 'vai-05', cat: 'menager', matiere: 'verre', name: 'Saladier décoré', price: 6500, stock: false, iconKey: 'saladier',
    desc: "Saladier profond en céramique avec motif peint à la main." },
  { id: 'vai-06', cat: 'menager', matiere: 'inox', name: 'Set de couverts inox 24 pièces', price: 18000, stock: true, iconKey: 'couverts',
    desc: "Couverts en acier inoxydable poli, résistants et faciles à entretenir. Set complet pour 6 personnes." },

  { id: 'gou-01', cat: 'menager', matiere: 'inox', name: 'Gourde inox isotherme 750ml', price: 8000, stock: true, iconKey: 'gourdeinox',
    desc: "Garde vos boissons froides 24h ou chaudes 12h. Double paroi en acier inoxydable, sans BPA." },
  { id: 'gou-02', cat: 'menager', matiere: 'inox', name: 'Thermos café 500ml', price: 9500, stock: true, iconKey: 'thermos',
    desc: "Thermos compact pour le café ou le thé, bouchon étanche, idéal pour la route ou le bureau." },
  { id: 'gou-03', cat: 'menager', matiere: 'verre', name: 'Bouteille en verre 1L', price: 5500, stock: true, iconKey: 'bouteilleverre',
    desc: "Bouteille en verre borosilicate avec housse de protection. Pour une hydratation sans plastique." },
  { id: 'gou-04', cat: 'menager', matiere: 'inox', name: 'Mug isotherme de voyage 350ml', price: 6000, stock: true, iconKey: 'mugisotherme',
    desc: "Mug étanche avec anse, compatible porte-gobelet. Reste chaud pendant des heures." },
  { id: 'gou-05', cat: 'menager', matiere: 'plastique', name: 'Gourde de sport 1L', price: 4500, stock: true, iconKey: 'gourdesport',
    desc: "Gourde légère avec bouchon push-pull, graduations de contenance. Parfaite pour le sport." },
  { id: 'gou-06', cat: 'menager', matiere: 'plastique', name: 'Lot de 2 gourdes enfant', price: 6500, stock: false, iconKey: 'lotgourdes',
    desc: "Deux petites gourdes colorées, format école, faciles à ouvrir pour les enfants." },

  { id: 'men-01', cat: 'menager', matiere: 'plastique', name: 'Balai-brosse avec manche', price: 4500, stock: true, iconKey: 'balai',
    desc: "Balai robuste pour l'entretien quotidien du sol, manche confortable." },
  { id: 'men-02', cat: 'menager', matiere: 'plastique', name: 'Seau 15L avec essoreuse', price: 8500, stock: true, iconKey: 'seau',
    desc: "Seau de ménage avec essoreuse intégrée, idéal pour le nettoyage des sols." },
  { id: 'men-03', cat: 'menager', matiere: 'autre', name: 'Panier à linge pliable', price: 5000, stock: true, iconKey: 'panierlinge',
    desc: "Grand panier à linge souple, se range facilement une fois vide." },
  { id: 'men-04', cat: 'menager', matiere: 'caoutchouc', name: 'Lot de 6 éponges + gants', price: 2500, stock: true, iconKey: 'eponge',
    desc: "Éponges double-face et gants de ménage en caoutchouc, pour toutes les surfaces." },
  { id: 'men-05', cat: 'menager', matiere: 'metal', name: 'Étagère de rangement 4 niveaux', price: 19000, stock: true, iconKey: 'rangement',
    desc: "Étagère modulable en métal pour la cuisine, la buanderie ou le salon." },

  { id: 'hab-01', cat: 'habillement', genre: 'homme', tissu: 'coton', name: 'Chemise homme manches longues', price: 9500, stock: true, iconKey: 'chemise',
    desc: "Chemise élégante en coton, coupe droite, idéale au bureau comme en sortie." },
  { id: 'hab-02', cat: 'habillement', genre: 'homme', tissu: 'jean', name: 'Pantalon chino homme', price: 12500, stock: true, iconKey: 'pantalon',
    desc: "Pantalon chino confortable, plusieurs coloris disponibles en boutique." },
  { id: 'hab-03', cat: 'habillement', genre: 'homme', tissu: 'bazin', name: 'Boubou traditionnel brodé', price: 25000, stock: true, iconKey: 'boubou',
    desc: "Boubou pour homme, broderies soignées, pour les grandes occasions." },
  { id: 'hab-04', cat: 'habillement', genre: 'femme', tissu: 'wax', name: 'Robe wax élégante', price: 18000, stock: true, iconKey: 'robe',
    desc: "Robe en tissu wax, coupe cintrée, confectionnée par nos couturiers partenaires." },
  { id: 'hab-05', cat: 'habillement', genre: 'femme', tissu: 'cuir', name: 'Sac à main femme', price: 14000, stock: true, iconKey: 'sac',
    desc: "Sac à main en simili-cuir, plusieurs compartiments, coloris sobres." },
  { id: 'hab-06', cat: 'habillement', genre: 'femme', tissu: 'synthetique', name: 'Baskets femme confort', price: 16000, stock: false, iconKey: 'basket',
    desc: "Baskets légères et confortables, parfaites pour un usage quotidien." },
];

function formatFCFA(n){
  return Number(n||0).toLocaleString('fr-FR').replace(/\u202f|,/g,' ') + ' FCFA';
}

function escapeHTML(s){
  return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function resolveIcon(data){
  if(data.imageUrl){
    return `<img src="${escapeHTML(data.imageUrl)}" alt="${escapeHTML(data.name)}" style="width:100%;height:100%;object-fit:contain;">`;
  }
  if(data.iconKey && ICONS[data.iconKey]) return ICONS[data.iconKey];
  return (CATEGORIES[data.cat] && CATEGORIES[data.cat].icon) || ICONS.boite;
}

/* ---------- Catalogue en mémoire, alimenté par Firestore ou par le repli local ---------- */
let PRODUCTS = [];
let productsLoaded = false;
let productsSource = 'local'; // 'firestore' ou 'local'

async function loadProducts(force){
  if(productsLoaded && !force) return PRODUCTS;
  try{
    if(typeof db === 'undefined' || !db) throw new Error('Firestore non configuré');
    const snap = await db.collection('products').orderBy('createdAt', 'asc').get();
    if(snap.empty){
      PRODUCTS = SEED_PRODUCTS.map(p => ({ ...p, icon: resolveIcon(p) }));
      productsSource = 'local';
    } else {
      PRODUCTS = snap.docs.map(doc => {
        const data = doc.data();
        const p = { id: doc.id, cat: data.cat, name: data.name, price: data.price, stock: !!data.stock,
                    desc: data.desc || '', iconKey: data.iconKey || '', imageUrl: data.imageUrl || '',
                    genre: data.genre || '', matiere: data.matiere || '', souscat: data.souscat || '',
                    tissu: data.tissu || '' };
        p.icon = resolveIcon(p);
        return p;
      });
      productsSource = 'firestore';
    }
  }catch(err){
    console.warn('Maison Sylla : catalogue Firestore indisponible, utilisation du catalogue de démonstration local.', err);
    PRODUCTS = SEED_PRODUCTS.map(p => ({ ...p, icon: resolveIcon(p) }));
    productsSource = 'local';
  }
  productsLoaded = true;
  return PRODUCTS;
}

function getProduct(id){
  return PRODUCTS.find(p => p.id === id);
}
