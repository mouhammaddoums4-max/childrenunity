# Photographies du site

Déposez les fichiers ici avec **exactement ces noms**. Le site les récupère
tout seul : aucun code à modifier. Tant qu'un fichier est absent, un motif
d'arcs aux couleurs de la charte prend sa place.

| Fichier          | Où il apparaît                             | Format conseillé        |
| ---------------- | ------------------------------------------ | ----------------------- |
| `community.webp` | Accueil — bloc « Qui nous sommes »          | 1600 × 1200, ratio 4/3  |
| `story.webp`     | À propos — bloc « Notre histoire »          | 1600 × 1200, ratio 4/3  |

`hero.webp` (à la racine de `public/`) sert de photo de bannière sur
l'accueil, et de solution de repli pour `community.webp`.

## Conseils

- **WebP**, qualité 80 : deux à trois fois plus léger qu'un JPEG équivalent.
- Largeur d'origine **1600 px minimum** — Next.js génère ensuite les tailles
  intermédiaires pour chaque écran.
- Sujet centré : l'image est recadrée (`object-cover`) et le cadrage varie
  entre mobile et bureau.
- Vérifiez les **droits d'usage** de chaque photo et l'accord des personnes
  photographiées, en particulier pour les mineurs.
- Le texte alternatif se traduit dans `src/i18n/fr.ts` et `src/i18n/en.ts`
  (clés `home.about.imageAlt`, `about.story.imageAlt`, `home.hero.imageAlt`).
