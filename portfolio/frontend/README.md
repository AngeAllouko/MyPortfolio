# Portfolio — frontend

React 19 + TypeScript + Vite, animé avec [Motion](https://motion.dev) et [Lenis](https://lenis.darkroom.engineering) (défilement fluide).

## Lancer le projet

```bash
npm install
npm run dev        # avec l'API Laravel (VITE_API_URL, par défaut http://localhost:8000/api)
npm run dev:demo   # sans backend, avec des données de démonstration
npm run build
```

Variables d'environnement inchangées : `VITE_API_URL` et `VITE_STORAGE_URL`.

## Ce qui a changé dans la refonte

**Données** — un seul `PortfolioProvider` (`src/data`) charge `/profile`, `/skills`, `/projects`,
`/experiences` et `/diplomas` une fois pour tout le site (avant : `/profile` était appelé 4 fois).
Il accepte les réponses en tableau, en objet ou en `{ data: [...] }`, et `technologies` en tableau,
JSON ou texte séparé par des virgules.

**Identité** — bleu nuit `#0E1A2E` et jaune vif `#FFDB00`, définis dans `src/index.css`
(un commentaire indique les valeurs pour revenir aux couleurs d'origine). Police : Bricolage
Grotesque variable, auto-hébergée via `@fontsource-variable`.

**Motion design** (`src/components/motion` et `src/components`)

| Élément | Animation |
| --- | --- |
| Ouverture (`Preloader`) | Écran jaune, le nom se décode, puis le panneau remonte (une fois par visite) |
| Titre du hero (`ScrambleText`) | Les lettres défilent en signes aléatoires puis se fixent |
| Titres, portrait, parcours, images de projets (`BlockReveal`) | Un volet jaune traverse et dévoile le contenu |
| Portrait | Le portrait et son contour suivent la souris en sens opposés |
| Bandeaux croisés (`Marquee`) | Deux bandes inclinées défilent en sens contraires |
| Services (`Tilt`) | Cartes distribuées en éventail, inclinées vers la souris avec un reflet jaune |
| Compétences | Jauges en 10 cases qui s'allument une à une |
| Chiffres clés | Se décodent comme le titre |
| Projets | Section épinglée : le défilement fait glisser les projets à l'horizontale, les cartes penchent selon la vitesse |
| Curseur (`Cursor`) | Pastille jaune qui suit la souris et grossit sur les liens |
| Navigation | Les liens se décodent au survol, soulignement jaune qui glisse |
| Menu mobile | Le fond tombe en 4 colonnes décalées |
| Boutons | Le libellé roule au survol |
| Formulaire | Étiquettes flottantes, validation par champ, coche dessinée à l'envoi |

**Arrière-plans** (`src/components/bg`) — formes générées en SVG dans l'esprit de Haikei :
`BlobScene` pose des blobs en couches dans les coins des sections (ils ondulent lentement) et
`LayeredWaves` fait la transition en vagues entre deux sections. Les couleurs viennent de
`src/lib/palette.ts`.

**Objets 3D** (`src/components/three-d`, en CSS 3D, sans WebGL) — cube de code qui tourne
et touche « Ctrl » dans l'accueil, accolades en relief, terminal qui tape `npm run dev`
(Services), processeur (Compétences), touche « Entrée » qui s'enfonce au survol (Contact).
Ils flottent et pivotent vers la souris ; plusieurs sont masqués sur mobile.

**Accessibilité** — `prefers-reduced-motion` respecté partout (Motion, Lenis, CSS), lien
« Aller au contenu », focus visible, textes animés lisibles par les lecteurs d'écran,
compétences exposées en `role="meter"`, erreurs de formulaire reliées aux champs.

`src/assets/hero.png`, `react.svg` et `vite.svg` (logos du gabarit Vite) ne sont plus utilisés.
