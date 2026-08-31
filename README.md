# Children's Unity Foundation — site web

Site vitrine bilingue (français / anglais) de la **Children's Unity Foundation (CUF)**,
organisation non gouvernementale indépendante, apolitique, non confessionnelle et à but
non lucratif, qui œuvre en Afrique pour l'éducation, le mentorat, la formation
professionnelle, le leadership, la protection de l'enfance et le développement des
communautés.

- Site : https://childrensunityfoundation.org
- Contact : contact@childrensunityfoundation.org

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 (tokens définis dans `src/app/globals.css`) |
| Icônes | lucide-react (SVG), logos de réseaux sociaux en SVG local |
| Polices | Poppins (titres) et Inter (texte), servies par `next/font` |

Toutes les pages sont pré-rendues en statique dans les deux langues.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Autres commandes :

```bash
npm run build    # build de production
npm start        # sert le build de production
npm run lint     # ESLint
npx tsc --noEmit # vérification des types
```

## Structure

```
src/
  app/
    [locale]/            toutes les pages, préfixées par /fr ou /en
      page.tsx           accueil
      about/             à propos (mission, valeurs, statut, équipe)
      programs/          les six programmes, avec ancre par programme
      impact/            chiffres, répartition des dépenses, pays
      news/              actualités + page d'article
      contact/           coordonnées et formulaire
      donate/            montants de don et transparence
    sitemap.ts, robots.ts
  components/            en-tête, pied de page, sections, composants d'interface
  i18n/                  fr.ts, en.ts (textes) et configuration des langues
  lib/                   content.ts (contenu éditorial), helpers
  middleware.ts          redirige / vers la langue du navigateur
```

## Modifier le contenu

Deux fichiers couvrent la quasi-totalité des textes :

- **`src/lib/content.ts`** — programmes, chiffres d'impact, pays, témoignages,
  équipe, actualités, coordonnées et montants de don. Chaque entrée porte ses deux
  versions linguistiques côte à côte, pour qu'aucune traduction ne soit oubliée.
- **`src/i18n/fr.ts` et `src/i18n/en.ts`** — libellés d'interface et textes de
  chaque page. Les deux fichiers partagent la même structure : `en.ts` est typé
  d'après `fr.ts`, donc une clé manquante fait échouer la compilation.

Le logo est dans `public/` en trois variantes : `logo.png` (original),
`logo-full.png` (fond transparent) et `logo-mark.png` (symbole seul, utilisé dans
l'en-tête, le pied de page et la bannière d'accueil).

## À brancher avant la mise en production

Ces éléments fonctionnent mais attendent un service réel :

- **Formulaire de contact** — ouvre aujourd'hui le logiciel de messagerie du
  visiteur avec un message pré-rempli (aucun message n'est perdu). Pour un envoi
  serveur, remplacer `openMailClient` dans `src/components/contact-form.tsx`.
- **Newsletter** — l'inscription est validée côté client uniquement. Brancher
  l'appel au prestataire dans `src/components/newsletter-form.tsx`.
- **Dons** — le paiement en ligne n'est pas activé : le bouton renvoie vers la page
  contact, et un message l'indique clairement. Brancher un prestataire de paiement
  dans `src/components/donation-widget.tsx`.
- **Réseaux sociaux** — les liens pointent vers les pages d'accueil des plateformes
  (`organisation.social` dans `src/lib/content.ts`).
- **Chiffres et équipe** — les valeurs présentées (10 000+ enfants, 500+ bénévoles,
  résultats par programme, membres de l'équipe) doivent être confirmées et
  actualisées à chaque exercice.

## Déploiement

Le site utilise un middleware pour rediriger `/` vers la langue du navigateur, ce qui
demande un hébergement Next.js (et non un export statique). Le plus direct est
[Vercel](https://vercel.com) : importer le dépôt, aucune configuration
supplémentaire n'est nécessaire.

Définir la variable d'environnement suivante pour le sitemap et les métadonnées de
partage :

```
NEXT_PUBLIC_SITE_URL=https://childrensunityfoundation.org
```
