# Espace Mariée Bahja — site web

```
imen-hanen/
├── index.html      la page
├── css/styles.css  couleurs, polices, mise en page
├── js/main.js      menu, filtres du lookbook, agrandissement des photos, formulaire
└── images/         les 18 photos (optimisées)
```

## Voir le site
Double-cliquez sur `index.html`. La carte ne s'affiche qu'une fois le site en ligne.

## À compléter (informations introuvables en ligne)
- **Carte** : elle recherche « Espace Mariée Bahja, Tunisie ». Pour viser l'adresse exacte, remplacez le texte après `q=` dans l'iframe de la carte (section CONTACT de `index.html`).
- **Téléphones** : +216 53 271 980 et +216 53 980 300 (repris du compte TikTok @espacemarieebahja) — à vérifier.
- **WhatsApp** : en haut de `js/main.js`, indiquez le numéro dans `WHATSAPP_NUMBER` (ex. `"21612345678"`). Tant qu'il est vide, le formulaire copie la demande et ouvre Messenger.

## Photos
Le début du nom de chaque photo indique sa collection : `mariee-…`, `tenue-…` / `caftan-…` (Tradition), `soiree-…`. Pour ajouter une photo au lookbook, copiez une ligne `<button class="look" …>` dans `index.html` et indiquez sa collection dans `data-cat` (`mariee`, `tenue` ou `soiree`).

## Mise en ligne
Glissez le dossier sur https://app.netlify.com/drop (gratuit), ou publiez-le sur GitHub Pages / tout hébergeur.
