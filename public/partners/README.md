# Logos des partenaires

Déposez ici un fichier par partenaire, puis déclarez-le dans
`src/lib/content.ts` :

```ts
export const partners: Partner[] = [
  {
    id: "ministere-education",
    name: "Ministère de l'Éducation",
    logo: "/partners/ministere-education.svg",
    href: "https://example.org",
  },
];
```

- `logo` est **facultatif** : sans fichier, le nom du partenaire s'affiche en
  toutes lettres dans la pastille.
- `href` est **facultatif** : sans lien, la pastille n'est pas cliquable.

Tant que `partners` est vide, la section « Nos partenaires » de l'accueil
affiche six emplacements vides pour donner à voir la mise en page.

## Format

- **SVG** de préférence, sinon **PNG à fond transparent**.
- Hauteur utile ~80 px, largeur libre (les logos sont centrés et mis à
  l'échelle sans déformation).
- Les logos s'affichent en niveaux de gris et reprennent leurs couleurs au
  survol : prévoyez un logo lisible en monochrome.
- N'affichez un logo qu'avec l'accord du partenaire concerné.
