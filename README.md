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

Le site est entièrement statique : **aucune base de données, aucun compte
utilisateur**. Toutes les pages sont pré-rendues dans les deux langues, à
l'exception du tunnel de don qui dépend de paramètres d'URL.

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
      sponsorship/       enfants à parrainer + fiche par enfant
      impact/            chiffres, répartition des dépenses, pays
      news/              actualités + page d'article
      contact/           coordonnées et formulaire
      donate/            présentation du don et transparence
      give/              tunnel de don et de parrainage (4 étapes)
    sitemap.ts, robots.ts
  components/            en-tête, pied de page, sections, composants d'interface
  i18n/                  fr.ts, en.ts (textes) et configuration des langues
  lib/                   contenu éditorial, devises, paiements, helpers
  middleware.ts          redirige / vers la langue du navigateur
```

## Modifier le contenu

Quatre fichiers couvrent la quasi-totalité du site :

| Fichier | Contenu |
|---|---|
| `src/lib/content.ts` | programmes, chiffres d'impact, pays, témoignages, équipe, actualités, coordonnées |
| `src/lib/sponsorship.ts` | enfants proposés au parrainage |
| `src/lib/payments.ts` | moyens de paiement et comptes à créditer |
| `src/i18n/fr.ts` · `src/i18n/en.ts` | libellés d'interface et textes de chaque page |

Chaque entrée de contenu porte ses **deux versions linguistiques côte à côte**,
pour qu'aucune traduction ne soit oubliée. `en.ts` est typé d'après `fr.ts` :
une clé manquante fait échouer la compilation plutôt que de passer inaperçue.

### Photos

Déposez le fichier dans `public/`, et déclarez son chemin **sans extension** :

```ts
photo: "/team/president"        // trouve president.webp, .jpg, .png ou .avif
```

Tant qu'aucun fichier n'existe, l'interface affiche un monogramme plutôt qu'une
image cassée (`src/lib/public-photo.ts`). Les dossiers `public/team/` et
`public/sponsorship/` attendent respectivement les portraits de l'équipe et les
photos d'enfants.

Le logo est dans `public/` en trois variantes : `logo.png` (original),
`logo-full.png` (fond transparent) et `logo-mark.png` (symbole seul, utilisé dans
l'en-tête, le pied de page et la bannière d'accueil).

### Devises

Le **franc guinéen est la devise de référence** : tous les montants sont
enregistrés en GNF, y compris les objectifs de parrainage. La devise affichée
est déduite du pays du visiteur (langue du navigateur, puis fuseau horaire),
il peut en choisir une autre, et son choix vaut pour tout le site.

Les taux de `src/lib/currency.ts` sont **indicatifs** et servent uniquement à
l'affichage. À réviser là, et nulle part ailleurs, quand ils auront dérivé.

## Paiements

Le tunnel `/give` fonctionne en **paiement assisté** : le donateur choisit un
montant et un moyen de paiement, reçoit une **référence unique**, puis effectue
lui-même le transfert en la rappelant. La fondation rapproche le versement grâce
à cette référence.

Aucune passerelle n'est branchée, et aucune donnée bancaire ne transite par le
site. Un moyen de paiement dont le compte n'est pas renseigné dans
`src/lib/payments.ts` est présenté comme « bientôt disponible » et reste
non cliquable : rien ne prétend encaisser ce qu'il ne peut pas encaisser.

> **À vérifier avant la mise en ligne** — Orange Money reprend pour l'instant le
> numéro de contact public de la fondation. Confirmez qu'il s'agit bien du compte
> qui doit recevoir les dons, et renseignez les autres comptes (MTN, Wave,
> virement) dans `accounts`, en haut de `src/lib/payments.ts`.

## À brancher avant la mise en production

- **Formulaire de contact et récapitulatif de don** — ouvrent le logiciel de
  messagerie du visiteur avec un message pré-rempli, ce qui fonctionne dès la
  mise en ligne. Pour un envoi serveur, remplacer `openMailClient` dans
  `src/components/contact-form.tsx`.
- **Newsletter** — inscription validée côté client seulement. Brancher le
  prestataire dans `src/components/newsletter-form.tsx`.
- **Réseaux sociaux** — Facebook et LinkedIn sont renseignés ; Instagram et
  YouTube apparaîtront dès qu'ils seront ajoutés à `organisation.social`.
- **Chiffres, équipe et fiches enfants** — les valeurs présentées (10 000+
  enfants, 500+ bénévoles, résultats par programme, membres de l'équipe, les
  trois fiches de parrainage) sont des **exemples de mise en page**. Elles
  doivent être remplacées par les données réelles.

### Protection des enfants

Les fiches de parrainage ne portent qu'un **prénom (ou un pseudonyme) et un
identifiant** : ni nom de famille, ni adresse, ni nom d'école. Une photo ou une
vidéo ne doit être publiée qu'avec l'accord écrit du représentant légal. Ces
fichiers étant versionnés dans un dépôt public, n'y déposez aucune donnée
personnelle qui ne soit pas destinée à être lue par tous.

## Feuille de route

L'espace connecté (parrains et membres) demande une base de données : elle seule
permet de vérifier qui a le droit d'accéder à quoi. L'ordre prévu :

1. Base PostgreSQL et modèle (membres, enfants, dons, parrainages, mises à jour)
2. Connexion par lien magique envoyé par email, code SMS en complément si besoin
3. Espace parrain : suivi de l'enfant, historique des versements, reçus
4. Espace d'administration : saisie des mises à jour, validation des paiements
5. Emails automatiques : reçus, points d'étape semestriels, rappels

Tant que le nombre de parrains reste modeste, l'envoi manuel des reçus et des
points d'étape depuis un outil d'emailing suffit.

## Sécurité et vie privée

Le site n'a ni base de données, ni compte utilisateur, ni formulaire enregistré
côté serveur : la surface d'attaque se limite à des pages statiques. Il n'y a
donc ni injection SQL, ni vol de session, ni élévation de privilèges possibles.

En complément, `next.config.ts` sert un jeu complet d'en-têtes :

| En-tête | Effet |
|---|---|
| `Content-Security-Policy` | seul le domaine du site peut fournir scripts, styles, images et polices ; seul YouTube sans cookie peut être mis en cadre |
| `Strict-Transport-Security` | HTTPS obligatoire pendant deux ans |
| `X-Frame-Options` · `frame-ancestors` | le site ne peut pas être encadré (clickjacking) |
| `X-Content-Type-Options` | interdit au navigateur de deviner un type de fichier |
| `Referrer-Policy` | l'URL complète n'est jamais transmise à un autre domaine |
| `Permissions-Policy` | caméra, micro, position, paiement et capteurs refusés |
| `Cross-Origin-*` | isole le site des autres onglets |

**Aucune requête ne part vers un domaine tiers.** Les polices sont auto-hébergées
par `next/font`, et les vidéos YouTube restent derrière une vignette : rien n'est
chargé chez Google tant que le visiteur n'a pas cliqué pour lire.

Ce qui reste à votre charge, et qui compte autant que le code : activer la
**double authentification** sur le compte GitHub, sur Railway et chez le
registrar du domaine. La plupart des sites tombent par un mot de passe, pas par
une faille applicative.

### Consentement

Le bandeau propose deux réponses, et l'absence de réponse vaut refus. Seules les
préférences d'affichage (langue, devise, réponse au bandeau) sont conservées,
dans le stockage local du navigateur — elles ne sont jamais transmises. La page
`/privacy` détaille l'ensemble.

## Déploiement sur Railway

Le middleware qui redirige `/` vers la langue du navigateur impose un hébergement
Next.js complet, et non un export statique. Railway convient parfaitement.

1. **New Project → Deploy from GitHub repo**, choisir `childrenunity`
2. Railway détecte Next.js et lit `railway.json` : build `npm run build`,
   démarrage `npm start`, contrôle de santé sur `/fr`
3. Ajouter les variables d'environnement ci-dessous
4. **Settings → Networking → Generate Domain**, puis brancher le domaine
   `childrensunityfoundation.org` et suivre les enregistrements DNS indiqués

Railway injecte lui-même la variable `PORT` ; le script `start` écoute sur
`0.0.0.0` pour que le conteneur soit joignable.

### Variables d'environnement

| Variable | Rôle | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique, utilisée par le sitemap et les aperçus de partage | oui |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | URL du formulaire d'inscription du prestataire d'emailing (Brevo, Mailchimp). Sans elle, l'inscription passe par le logiciel de messagerie du visiteur | non |

```
NEXT_PUBLIC_SITE_URL=https://childrensunityfoundation.org
```

Ces variables sont lues **à la compilation** : après les avoir modifiées dans
Railway, relancez un déploiement pour qu'elles soient prises en compte.
