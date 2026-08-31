import type { Locale } from "@/i18n/config";

/**
 * Contenu éditorial du site, bilingue.
 *
 * C'est le seul fichier à modifier pour mettre à jour les programmes,
 * les chiffres d'impact, les actualités, l'équipe ou les coordonnées.
 * Chaque entrée porte ses deux versions linguistiques côte à côte pour
 * éviter qu'une traduction soit oubliée lors d'une mise à jour.
 */

type Localized<T> = Record<Locale, T>;

function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/* ------------------------------------------------------------------ */
/* Programmes                                                          */
/* ------------------------------------------------------------------ */

export type Accent = "brand" | "teal" | "orange";

export type ProgramIcon =
  | "book"
  | "steps"
  | "briefcase"
  | "compass"
  | "shield"
  | "community";

type ProgramContent = {
  title: string;
  summary: string;
  description: string;
  features: string[];
  result: string;
};

type ProgramSource = {
  slug: string;
  icon: ProgramIcon;
  accent: Accent;
  content: Localized<ProgramContent>;
};

const programSources: ProgramSource[] = [
  {
    slug: "education",
    icon: "book",
    accent: "brand",
    content: {
      fr: {
        title: "Éducation",
        summary: "Offrir un accès équitable à une éducation de qualité.",
        description:
          "Nous prenons en charge les frais de scolarité, les fournitures et les manuels des enfants dont la famille ne peut pas les assumer, et nous travaillons avec les écoles pour améliorer les conditions d'apprentissage.",
        features: [
          "Prise en charge des frais de scolarité et de l'inscription",
          "Fournitures, manuels et uniformes fournis chaque rentrée",
          "Cours de soutien pour les élèves en difficulté",
          "Réhabilitation de salles de classe et de bibliothèques",
        ],
        result: "6 800 enfants scolarisés grâce au programme cette année.",
      },
      en: {
        title: "Education",
        summary: "Providing fair access to quality education.",
        description:
          "We cover school fees, supplies and textbooks for children whose families cannot afford them, and we work with schools to improve learning conditions.",
        features: [
          "School fees and enrolment costs covered",
          "Supplies, textbooks and uniforms provided every school year",
          "Tutoring for pupils who are falling behind",
          "Renovation of classrooms and libraries",
        ],
        result: "6,800 children enrolled through this program this year.",
      },
    },
  },
  {
    slug: "mentoring",
    icon: "steps",
    accent: "teal",
    content: {
      fr: {
        title: "Mentorat",
        summary: "Accompagner les enfants vers la réussite.",
        description:
          "Chaque enfant suivi est associé à un mentor formé qui le rencontre régulièrement, suit ses résultats et alerte l'équipe dès les premiers signes de décrochage.",
        features: [
          "Un mentor référent pour chaque enfant accompagné",
          "Rencontres mensuelles et suivi des bulletins scolaires",
          "Ateliers d'orientation dès la fin du primaire",
          "Médiation avec l'école et la famille en cas de difficulté",
        ],
        result: "92 % des enfants mentorés poursuivent leur scolarité l'année suivante.",
      },
      en: {
        title: "Mentoring",
        summary: "Guiding children towards success.",
        description:
          "Every child we support is paired with a trained mentor who meets them regularly, follows their results and alerts the team at the first sign of dropout.",
        features: [
          "A dedicated mentor for every child supported",
          "Monthly meetings and school report follow-up",
          "Career guidance workshops from the end of primary school",
          "Mediation with school and family when difficulties arise",
        ],
        result: "92% of mentored children continue their schooling the following year.",
      },
    },
  },
  {
    slug: "training",
    icon: "briefcase",
    accent: "orange",
    content: {
      fr: {
        title: "Formation",
        summary: "Développer des compétences pour l'autonomie.",
        description:
          "Pour les adolescents et jeunes adultes, nous finançons des formations professionnelles courtes et qualifiantes, en lien direct avec les besoins des employeurs locaux.",
        features: [
          "Formations qualifiantes de 6 à 18 mois",
          "Partenariats avec des ateliers et entreprises locales",
          "Kit d'installation à la fin de la formation",
          "Accompagnement à la recherche d'emploi et à l'entrepreneuriat",
        ],
        result: "3 jeunes formés sur 4 exercent un métier douze mois après leur sortie.",
      },
      en: {
        title: "Vocational training",
        summary: "Building skills for independence.",
        description:
          "For teenagers and young adults, we fund short, qualifying vocational courses designed around the real needs of local employers.",
        features: [
          "Qualifying courses lasting 6 to 18 months",
          "Partnerships with local workshops and businesses",
          "Start-up toolkit on completion of the course",
          "Support with job hunting and starting a business",
        ],
        result: "3 out of 4 trained young people are working twelve months after graduating.",
      },
    },
  },
  {
    slug: "leadership",
    icon: "compass",
    accent: "brand",
    content: {
      fr: {
        title: "Leadership",
        summary: "Révéler les leaders de demain.",
        description:
          "Nous formons les jeunes à prendre la parole, à porter un projet et à s'engager dans leur communauté. Le leadership s'apprend, et il commence bien avant l'âge adulte.",
        features: [
          "Ateliers de prise de parole et de confiance en soi",
          "Conduite de projet, du budget au compte rendu",
          "Clubs de jeunes leaders dans les écoles partenaires",
          "Rencontres avec des professionnels et des élus locaux",
        ],
        result: "1 200 jeunes formés au leadership et à la conduite de projet.",
      },
      en: {
        title: "Leadership",
        summary: "Bringing out tomorrow's leaders.",
        description:
          "We train young people to speak up, carry a project through and get involved in their community. Leadership is learned, and it starts long before adulthood.",
        features: [
          "Public-speaking and self-confidence workshops",
          "Project management, from budget to final report",
          "Young leaders' clubs in partner schools",
          "Meetings with professionals and local officials",
        ],
        result: "1,200 young people trained in leadership and project management.",
      },
    },
  },
  {
    slug: "child-protection",
    icon: "shield",
    accent: "teal",
    content: {
      fr: {
        title: "Protection de l'enfance",
        summary: "Faire respecter les droits de chaque enfant.",
        description:
          "Nous formons les adultes qui entourent l'enfant à repérer et signaler les situations de danger, et nous accompagnons les enfants concernés jusqu'à ce qu'une solution durable soit trouvée.",
        features: [
          "Formation des enseignants et des parents au repérage",
          "Point d'écoute confidentiel dans les écoles partenaires",
          "Accompagnement juridique et social des enfants concernés",
          "Sensibilisation aux droits de l'enfant dans les communautés",
        ],
        result: "340 enfants accompagnés par le dispositif de protection.",
      },
      en: {
        title: "Child protection",
        summary: "Upholding the rights of every child.",
        description:
          "We train the adults around the child to spot and report situations of danger, and we support the children concerned until a lasting solution is found.",
        features: [
          "Training teachers and parents to spot warning signs",
          "A confidential listening point in partner schools",
          "Legal and social support for the children concerned",
          "Community awareness sessions on children's rights",
        ],
        result: "340 children supported by the protection service.",
      },
    },
  },
  {
    slug: "community-development",
    icon: "community",
    accent: "orange",
    content: {
      fr: {
        title: "Développement des communautés",
        summary: "Renforcer tout ce qui entoure l'enfant.",
        description:
          "Un enfant ne grandit pas seul. Nous appuyons les familles et les communautés par l'alphabétisation, l'entraide et le soutien aux activités génératrices de revenus.",
        features: [
          "Cours d'alphabétisation pour les adultes",
          "Groupes d'entraide entre parents",
          "Micro-subventions pour les activités génératrices de revenus",
          "Appui aux comités de gestion des écoles",
        ],
        result: "45 communautés accompagnées de façon continue.",
      },
      en: {
        title: "Community development",
        summary: "Strengthening everything around the child.",
        description:
          "A child does not grow up alone. We support families and communities through adult literacy, peer support and help with income-generating activities.",
        features: [
          "Adult literacy classes",
          "Peer support groups for parents",
          "Micro-grants for income-generating activities",
          "Support for school management committees",
        ],
        result: "45 communities receiving continuous support.",
      },
    },
  },
];

export type Program = ProgramContent & {
  slug: string;
  icon: ProgramIcon;
  accent: Accent;
};

export function getPrograms(locale: Locale): Program[] {
  return programSources.map((program) => ({
    slug: program.slug,
    icon: program.icon,
    accent: program.accent,
    ...pick(program.content, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Chiffres clés                                                       */
/* ------------------------------------------------------------------ */

export type StatIcon = "smile" | "users" | "graduation" | "globe";

type StatSource = {
  value: string;
  icon: StatIcon;
  accent: Accent;
  label: Localized<string>;
};

const statSources: StatSource[] = [
  {
    value: "10 000+",
    icon: "smile",
    accent: "brand",
    label: { fr: "Enfants accompagnés", en: "Children supported" },
  },
  {
    value: "500+",
    icon: "users",
    accent: "teal",
    label: { fr: "Bénévoles engagés", en: "Active volunteers" },
  },
  {
    value: "50+",
    icon: "graduation",
    accent: "orange",
    label: { fr: "Programmes actifs", en: "Running programs" },
  },
  {
    value: "8",
    icon: "globe",
    accent: "brand",
    label: { fr: "Pays d'intervention", en: "Countries of operation" },
  },
];

export type Stat = {
  value: string;
  icon: StatIcon;
  accent: Accent;
  label: string;
};

export function getStats(locale: Locale): Stat[] {
  return statSources.map((stat) => ({
    value: stat.value,
    icon: stat.icon,
    accent: stat.accent,
    label: pick(stat.label, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Résultats détaillés (page Impact)                                   */
/* ------------------------------------------------------------------ */

type ResultSource = {
  value: string;
  accent: Accent;
  label: Localized<string>;
  detail: Localized<string>;
};

const resultSources: ResultSource[] = [
  {
    value: "6 800",
    accent: "brand",
    label: { fr: "Enfants scolarisés", en: "Children enrolled in school" },
    detail: {
      fr: "Frais, fournitures et manuels pris en charge sur l'année scolaire.",
      en: "Fees, supplies and textbooks covered for the full school year.",
    },
  },
  {
    value: "92 %",
    accent: "teal",
    label: { fr: "Taux de maintien scolaire", en: "School retention rate" },
    detail: {
      fr: "Part des enfants mentorés qui poursuivent leur scolarité l'année suivante.",
      en: "Share of mentored children who continue their schooling the next year.",
    },
  },
  {
    value: "75 %",
    accent: "orange",
    label: { fr: "Insertion après formation", en: "Employment after training" },
    detail: {
      fr: "Jeunes exerçant un métier douze mois après leur formation professionnelle.",
      en: "Young people working twelve months after their vocational training.",
    },
  },
  {
    value: "1 200",
    accent: "brand",
    label: { fr: "Jeunes formés au leadership", en: "Young people trained in leadership" },
    detail: {
      fr: "Prise de parole, conduite de projet et engagement citoyen.",
      en: "Public speaking, project management and civic engagement.",
    },
  },
  {
    value: "340",
    accent: "teal",
    label: { fr: "Enfants protégés", en: "Children protected" },
    detail: {
      fr: "Situations prises en charge par le dispositif de protection de l'enfance.",
      en: "Cases handled by the child protection service.",
    },
  },
  {
    value: "45",
    accent: "orange",
    label: { fr: "Communautés accompagnées", en: "Communities supported" },
    detail: {
      fr: "Alphabétisation, entraide et appui aux revenus des foyers.",
      en: "Literacy, peer support and help with household income.",
    },
  },
];


export type Result = {
  value: string;
  accent: Accent;
  label: string;
  detail: string;
};

export function getResults(locale: Locale): Result[] {
  return resultSources.map((result) => ({
    value: result.value,
    accent: result.accent,
    label: pick(result.label, locale),
    detail: pick(result.detail, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Pays d'intervention                                                 */
/* ------------------------------------------------------------------ */

type CountrySource = {
  code: string;
  since: string;
  name: Localized<string>;
};

const countrySources: CountrySource[] = [
  { code: "GN", since: "2014", name: { fr: "Guinée", en: "Guinea" } },
  { code: "SN", since: "2016", name: { fr: "Sénégal", en: "Senegal" } },
  { code: "ML", since: "2017", name: { fr: "Mali", en: "Mali" } },
  { code: "CI", since: "2018", name: { fr: "Côte d'Ivoire", en: "Ivory Coast" } },
  { code: "BF", since: "2019", name: { fr: "Burkina Faso", en: "Burkina Faso" } },
  { code: "BJ", since: "2020", name: { fr: "Bénin", en: "Benin" } },
  { code: "TG", since: "2021", name: { fr: "Togo", en: "Togo" } },
  { code: "NE", since: "2022", name: { fr: "Niger", en: "Niger" } },
];

export type Country = { code: string; since: string; name: string };

export function getCountries(locale: Locale): Country[] {
  return countrySources.map((country) => ({
    code: country.code,
    since: country.since,
    name: pick(country.name, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Témoignages                                                         */
/* ------------------------------------------------------------------ */

type TestimonialSource = {
  id: string;
  author: string;
  accent: Accent;
  role: Localized<string>;
  quote: Localized<string>;
};

const testimonialSources: TestimonialSource[] = [
  {
    id: "aissatou",
    author: "Aïssatou B.",
    accent: "brand",
    role: { fr: "Mère de deux enfants accompagnés", en: "Mother of two supported children" },
    quote: {
      fr: "Je ne pouvais plus payer la rentrée de mes deux garçons. La fondation a pris le relais, et surtout quelqu'un passe encore prendre de leurs nouvelles chaque mois.",
      en: "I could no longer pay for my two boys to go back to school. The foundation stepped in, and someone still comes to check on them every month.",
    },
  },
  {
    id: "moussa",
    author: "Moussa D.",
    accent: "teal",
    role: { fr: "Directeur d'école partenaire", en: "Head of a partner school" },
    quote: {
      fr: "Depuis la cantine, les enfants restent en classe l'après-midi. C'est simple, mais ça a changé nos résultats de fin d'année.",
      en: "Since the canteen opened, children stay in class in the afternoon. It sounds simple, but it changed our end-of-year results.",
    },
  },
  {
    id: "fatoumata",
    author: "Fatoumata S.",
    accent: "orange",
    role: { fr: "Ancienne boursière, aujourd'hui infirmière", en: "Former scholar, now a nurse" },
    quote: {
      fr: "J'étais la première de ma famille à passer le baccalauréat. La bourse a payé mes études, mais c'est le suivi qui m'a empêchée d'abandonner.",
      en: "I was the first in my family to finish secondary school. The scholarship paid for my studies, but it was the follow-up that kept me from giving up.",
    },
  },
];

export type Testimonial = {
  id: string;
  author: string;
  accent: Accent;
  role: string;
  quote: string;
};

export function getTestimonials(locale: Locale): Testimonial[] {
  return testimonialSources.map((testimonial) => ({
    id: testimonial.id,
    author: testimonial.author,
    accent: testimonial.accent,
    role: pick(testimonial.role, locale),
    quote: pick(testimonial.quote, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Équipe                                                              */
/* ------------------------------------------------------------------ */
/* À remplacer par les membres réels de la fondation.                  */

type MemberSource = {
  id: string;
  name: string;
  accent: Accent;
  /** Chemin sans extension, ex. "/team/president". Monogramme si absent. */
  photo?: string;
  role: Localized<string>;
};

const memberSources: MemberSource[] = [
  {
    id: "president",
    name: "Mouhammad Doumbouya",
    accent: "brand",
    photo: "/team/president",
    role: { fr: "Président de la fondation", en: "President of the foundation" },
  },
  {
    id: "programs",
    name: "Ibrahima Sow",
    accent: "teal",
    role: { fr: "Responsable des programmes", en: "Head of Programs" },
  },
  {
    id: "field",
    name: "Nadia Traoré",
    accent: "orange",
    role: { fr: "Coordination terrain", en: "Field Coordination" },
  },
  {
    id: "partnerships",
    name: "Ousmane Baldé",
    accent: "brand",
    role: { fr: "Partenariats et mécénat", en: "Partnerships and Sponsorship" },
  },
];

export type Member = {
  id: string;
  name: string;
  accent: Accent;
  photo?: string;
  role: string;
};

export function getTeam(locale: Locale): Member[] {
  return memberSources.map((member) => ({
    id: member.id,
    name: member.name,
    accent: member.accent,
    photo: member.photo,
    role: pick(member.role, locale),
  }));
}

/* ------------------------------------------------------------------ */
/* Actualités                                                          */
/* ------------------------------------------------------------------ */

type ArticleContent = {
  title: string;
  category: string;
  excerpt: string;
  body: string[];
};

type ArticleSource = {
  slug: string;
  date: string;
  readingTime: number;
  accent: Accent;
  content: Localized<ArticleContent>;
};

const articleSources: ArticleSource[] = [
  {
    slug: "rentree-scolaire",
    date: "2026-09-15",
    readingTime: 4,
    accent: "brand",
    content: {
      fr: {
        title: "Une rentrée scolaire pour 6 800 enfants",
        category: "Éducation",
        excerpt:
          "Fournitures, manuels et frais d'inscription : le point sur la plus grande rentrée organisée par la fondation à ce jour.",
        body: [
          "Pendant trois semaines, nos équipes et nos bénévoles ont préparé, trié et distribué les kits scolaires dans les huit pays où la fondation intervient. Au total, 6 800 enfants ont fait leur rentrée avec des fournitures complètes et des frais d'inscription réglés.",
          "L'opération mobilise chaque année une logistique importante : recensement des familles dès le mois de juin, commande groupée auprès de fournisseurs locaux, puis distribution école par école en présence des directeurs.",
          "Un grand merci aux 500 bénévoles qui ont rendu cette rentrée possible, et aux donateurs qui l'ont financée.",
        ],
      },
      en: {
        title: "A new school year for 6,800 children",
        category: "Education",
        excerpt:
          "Supplies, textbooks and enrolment fees: a look back at the largest back-to-school operation the foundation has run so far.",
        body: [
          "For three weeks, our teams and volunteers prepared, sorted and handed out school kits across the eight countries where the foundation works. In total, 6,800 children started the year with a full set of supplies and their enrolment fees paid.",
          "The operation takes serious logistics every year: families are identified from June, supplies are ordered in bulk from local suppliers, then distributed school by school with the head teachers present.",
          "A huge thank you to the 500 volunteers who made this possible, and to the donors who funded it.",
        ],
      },
    },
  },
  {
    slug: "cantine-scolaire",
    date: "2026-07-02",
    readingTime: 3,
    accent: "teal",
    content: {
      fr: {
        title: "Trois nouvelles cantines scolaires ouvrent leurs portes",
        category: "Santé & Nutrition",
        excerpt:
          "Un repas chaud par jour de classe change la présence en cours, surtout l'après-midi. Retour sur l'ouverture de trois cantines.",
        body: [
          "Trois écoles partenaires disposent désormais d'une cantine gérée par un comité de parents, formé et accompagné par nos équipes pendant les six premiers mois.",
          "Le principe est simple : les denrées sont achetées auprès des producteurs des environs, les repas sont préparés sur place, et le comité rend compte des dépenses chaque mois.",
          "Là où les cantines existent depuis plus d'un an, les directeurs constatent une présence en classe nettement plus régulière l'après-midi.",
        ],
      },
      en: {
        title: "Three new school canteens open their doors",
        category: "Health & Nutrition",
        excerpt:
          "One hot meal per school day changes attendance, especially in the afternoon. A look at three new canteens.",
        body: [
          "Three partner schools now have a canteen run by a parents' committee, trained and supported by our teams for the first six months.",
          "The principle is simple: food is bought from nearby producers, meals are cooked on site, and the committee reports on spending every month.",
          "Where canteens have been running for over a year, head teachers report noticeably steadier attendance in the afternoon.",
        ],
      },
    },
  },
  {
    slug: "appel-benevoles",
    date: "2026-05-20",
    readingTime: 2,
    accent: "orange",
    content: {
      fr: {
        title: "Appel à bénévoles pour la saison de mentorat",
        category: "Bénévolat",
        excerpt:
          "Nous recherchons des mentors, sur le terrain comme à distance, pour accompagner les enfants tout au long de l'année scolaire.",
        body: [
          "Le mentorat est le cœur de notre méthode : un adulte formé, disponible, qui rencontre l'enfant chaque mois et reste en lien avec sa famille et son école.",
          "Aucune expérience préalable n'est requise. Nous assurons une formation initiale de deux jours, puis un point d'échange mensuel entre mentors.",
          "L'engagement demandé est d'une année scolaire complète, à raison de quelques heures par mois. Écrivez-nous pour recevoir le dossier de candidature.",
        ],
      },
      en: {
        title: "Call for volunteers for the mentoring season",
        category: "Volunteering",
        excerpt:
          "We are looking for mentors, in the field and remotely, to support children throughout the school year.",
        body: [
          "Mentoring is at the heart of our method: a trained, available adult who meets the child every month and stays in touch with their family and school.",
          "No prior experience is required. We provide two days of initial training, then a monthly catch-up between mentors.",
          "The commitment is one full school year, a few hours a month. Write to us to receive the application pack.",
        ],
      },
    },
  },
];

export type Article = ArticleContent & {
  slug: string;
  date: string;
  readingTime: number;
  accent: Accent;
};

export function getArticles(locale: Locale): Article[] {
  return articleSources
    .map((article) => ({
      slug: article.slug,
      date: article.date,
      readingTime: article.readingTime,
      accent: article.accent,
      ...pick(article.content, locale),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticles(locale).find((article) => article.slug === slug);
}

export function getArticleSlugs(): string[] {
  return articleSources.map((article) => article.slug);
}

/* ------------------------------------------------------------------ */
/* Coordonnées                                                         */
/* ------------------------------------------------------------------ */
/* À remplacer par les coordonnées réelles de la fondation.            */

export const organisation = {
  name: "Children's Unity Foundation",
  shortName: "CUF",
  email: "contact@childrensunityfoundation.org",
  phone: "+224 627 84 30 30",
  phoneHref: "+224627843030",
  address: ["Conakry", "République de Guinée"],
  /* Seuls les reseaux reellement ouverts sont listes : le pied de page et
     la barre laterale n'affichent que les entrees presentes ici. */
  social: {
    facebook: "https://www.facebook.com/childrensunityfoundation",
    linkedin: "https://www.linkedin.com/company/childrensunityfoundation",
  } as Partial<Record<"facebook" | "instagram" | "linkedin" | "youtube", string>>,
};


/* ------------------------------------------------------------------ */
/* Partenaires et soutiens                                             */
/* ------------------------------------------------------------------ */
/*
 * Pour afficher un partenaire, ajouter une entrée ici :
 *   { id: "unicef", name: "UNICEF", logo: "/partners/unicef.svg",
 *     href: "https://..." }
 * `logo` est un fichier déposé dans `public/partners/` (SVG de préférence,
 * sinon PNG sur fond transparent, hauteur utile ~80 px). Sans `logo`, le
 * nom du partenaire s'affiche en toutes lettres. Tant que la liste est
 * vide, la section montre des emplacements vides.
 */

export type Partner = {
  id: string;
  name: string;
  logo?: string;
  href?: string;
};

export const partners: Partner[] = [];


/* ------------------------------------------------------------------ */
/* Montants de don proposés                                            */
/* ------------------------------------------------------------------ */

export const donationAmounts = [25, 50, 120, 250] as const;

export type DonationAmount = (typeof donationAmounts)[number];
