# La Pièce Secrète — one-pager

Site vitrine d'une page pour La Pièce Secrète, une division de Brissette & Fils (licence RBQ 5695-2534-01).

Le site est en HTML, CSS et JavaScript, sans dépendance ni étape de build. Les polices sont hébergées localement, et le site n'utilise ni témoin ni outil de suivi.

## Structure

```
index.html              La page (9 sections, selon le plan d'implantation)
assets/css/styles.css   Styles et palette (jetons en tête de fichier)
assets/js/main.js       Menu mobile, animations, bascule « pièce réversible », formulaire
assets/img/             Bibliothèque pivotante (SVG) et image de partage og.png (1200×630)
assets/fonts/           Cormorant Garamond et Jost (licence SIL OFL)
favicon.svg, robots.txt, sitemap.xml
```

## Aperçu local

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne sur Netlify

`netlify.toml` indique à Netlify de publier la racine du dépôt, sans build. Il suffit d'importer le dépôt dans Netlify (Add new site → Import an existing project → GitHub), avec `main` comme branche de production.

Après le premier déploiement, dans **Domain management**, ajoutez `lapiecesecrete.ca`. Le certificat HTTPS est automatique. La détection de formulaires de Netlify n'est pas nécessaire : le formulaire passe par Formspree.

## Formulaire de consultation

Le formulaire envoie les demandes à **Formspree** (`https://formspree.io/f/xjygadnz`, dans l'attribut `action` du `<form>`). Formspree transmet chaque demande par courriel et la conserve dans son tableau de bord.

- L'envoi se fait en JavaScript (`fetch`), sans recharger la page, puis le message de confirmation s'affiche. Sans JavaScript, le formulaire s'envoie quand même normalement à Formspree.
- Le champ courriel s'appelle `email` : Formspree s'en sert comme adresse de réponse, donc « Répondre » dans le courriel reçu écrit directement au client.
- `_subject` donne un objet neutre aux courriels reçus : « Nouvelle demande de consultation ».
- `_gotcha` est le pot de miel anti-robot reconnu par Formspree.

Seul le champ courriel est obligatoire.

## À valider avant la mise en ligne

- **Domaine** : `lapiecesecrete.ca` est utilisé dans les balises canonique et Open Graph, dans `robots.txt` et dans `sitemap.xml`. À ajuster si le domaine réservé est différent.
- **Courriel de confidentialité** : `confidentialite@lapiecesecrete.ca`, dans la politique en pied de page (Loi 25). Il doit exister et être lu par la personne responsable de la protection des renseignements personnels.
- **Prix** : les prix de départ (12 000 $, 35 000 $, 75 000 $) et les frais de conception (750 $) se trouvent dans la section `#forfaits` de `index.html`.
- **Photos** : la page n'en contient aucune pour l'instant. Les photos du projet vitrine pourront s'ajouter dans les sections « Ce qu'on transforme » et « Forfaits », une fois le consentement écrit obtenu.
