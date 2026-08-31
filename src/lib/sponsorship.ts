import type { Locale } from "@/i18n/config";
import type { Accent } from "./content";
import { publicData } from "./publication";

/**
 * Enfants proposés au parrainage.
 *
 * Protection de la vie privée : ces fiches ne portent qu'un prénom (ou un
 * pseudonyme) et un identifiant. Ni nom de famille, ni école, ni adresse.
 * Une photo n'est publiée que si l'accord écrit du représentant légal a été
 * recueilli ; à défaut, la fiche affiche un monogramme.
 *
 * Les fiches ci-dessous sont des exemples de mise en page : elles doivent
 * être remplacées par les dossiers réels avant la mise en ligne.
 */

type ChildContent = {
  /** Récit court, un paragraphe par entrée. */
  story: string[];
  needs: string[];
  objectives: string[];
};

type ChildSource = {
  /** Identifiant public communiqué au parrain. */
  reference: string;
  firstName: string;
  age: number;
  grade: Localized<string>;
  country: Localized<string>;
  accent: Accent;
  /** Chemin sans extension dans public/sponsorship/, si autorisation. */
  photo?: string;
  /** Identifiant de la vidéo YouTube de présentation, si elle existe. */
  videoId?: string;
  /** Coût annuel de l'accompagnement, en francs guinéens. */
  goal: number;
  /** Part déjà financée, en francs guinéens. */
  raised: number;
  content: Localized<ChildContent>;
};

type Localized<T> = Record<Locale, T>;

function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

const childSources: ChildSource[] = [
  {
    reference: "CUF-2026-014",
    firstName: "Aminata",
    age: 11,
    accent: "brand",
    grade: { fr: "CM2", en: "Year 6" },
    country: { fr: "Guinée", en: "Guinea" },
    goal: 3_200_000,
    raised: 2_100_000,
    content: {
      fr: {
        story: [
          "Aminata est l'aînée de quatre enfants. Depuis que son père est tombé malade, sa mère fait vivre la famille seule, et la scolarité d'Aminata a été la première dépense mise de côté.",
          "Elle a rejoint le programme il y a deux ans. Ses résultats en mathématiques la placent aujourd'hui dans les premières de sa classe, et elle veut devenir sage-femme.",
        ],
        needs: [
          "Frais de scolarité et d'inscription",
          "Fournitures et manuels scolaires",
          "Transport quotidien vers l'école",
        ],
        objectives: [
          "Terminer le cycle primaire avec mention",
          "Intégrer le collège à la rentrée prochaine",
        ],
      },
      en: {
        story: [
          "Aminata is the eldest of four children. Since her father fell ill, her mother has supported the family alone, and Aminata's schooling was the first expense to be set aside.",
          "She joined the program two years ago. Her maths results now place her among the top of her class, and she wants to become a midwife.",
        ],
        needs: [
          "School and enrolment fees",
          "Supplies and textbooks",
          "Daily transport to school",
        ],
        objectives: [
          "Finish primary school with distinction",
          "Start secondary school next year",
        ],
      },
    },
  },
  {
    reference: "CUF-2026-027",
    firstName: "Sékou",
    age: 14,
    accent: "teal",
    grade: { fr: "4e", en: "Year 9" },
    country: { fr: "Guinée", en: "Guinea" },
    goal: 4_200_000,
    raised: 1_200_000,
    content: {
      fr: {
        story: [
          "Sékou a quitté l'école pendant un an pour travailler sur le marché avec son oncle. Un enseignant l'a signalé à notre équipe, qui a repris contact avec sa famille.",
          "Il est rescolarisé depuis la rentrée et suit un cours de rattrapage deux soirs par semaine. Il répare déjà les téléphones du quartier et vise une formation en électronique.",
        ],
        needs: [
          "Frais de scolarité et cours de rattrapage",
          "Fournitures et calculatrice scientifique",
          "Suivi mensuel par un mentor",
        ],
        objectives: [
          "Rattraper le niveau de sa classe d'âge",
          "Entrer en formation professionnelle en électronique",
        ],
      },
      en: {
        story: [
          "Sékou left school for a year to work at the market with his uncle. A teacher flagged his case to our team, who reconnected with his family.",
          "He has been back in school since September and attends catch-up classes two evenings a week. He already repairs phones in his neighbourhood and is aiming for training in electronics.",
        ],
        needs: [
          "School fees and catch-up classes",
          "Supplies and a scientific calculator",
          "Monthly follow-up with a mentor",
        ],
        objectives: [
          "Catch up with his age group",
          "Enter vocational training in electronics",
        ],
      },
    },
  },
  {
    reference: "CUF-2026-039",
    firstName: "Mariama",
    age: 9,
    accent: "orange",
    grade: { fr: "CE2", en: "Year 4" },
    country: { fr: "Guinée", en: "Guinea" },
    goal: 2_800_000,
    raised: 2_650_000,
    content: {
      fr: {
        story: [
          "Mariama vit chez sa grand-mère depuis trois ans. Elle marchait une heure chaque matin pour rejoindre l'école la plus proche.",
          "Depuis qu'elle est accompagnée, elle mange à la cantine le midi et ses absences ont cessé. Sa maîtresse la décrit comme la plus curieuse de sa classe.",
        ],
        needs: [
          "Frais de scolarité et fournitures",
          "Repas de midi à la cantine scolaire",
          "Visite médicale annuelle",
        ],
        objectives: [
          "Maintenir une présence régulière toute l'année",
          "Consolider la lecture et l'écriture",
        ],
      },
      en: {
        story: [
          "Mariama has lived with her grandmother for three years. She used to walk an hour every morning to reach the nearest school.",
          "Since joining the program she eats lunch at the canteen and her absences have stopped. Her teacher describes her as the most curious pupil in the class.",
        ],
        needs: [
          "School fees and supplies",
          "Lunch at the school canteen",
          "Annual medical check-up",
        ],
        objectives: [
          "Keep steady attendance all year",
          "Strengthen reading and writing",
        ],
      },
    },
  },
];

export type Child = ChildContent & {
  reference: string;
  firstName: string;
  age: number;
  accent: Accent;
  photo?: string;
  videoId?: string;
  goal: number;
  raised: number;
  grade: string;
  country: string;
  /** Part financée, arrondie, entre 0 et 100. */
  progress: number;
};

export function getChildren(locale: Locale): Child[] {
  return publicData(childSources).map((child) => ({
    reference: child.reference,
    firstName: child.firstName,
    age: child.age,
    accent: child.accent,
    photo: child.photo,
    videoId: child.videoId,
    goal: child.goal,
    raised: child.raised,
    grade: pick(child.grade, locale),
    country: pick(child.country, locale),
    progress: Math.min(100, Math.round((child.raised / child.goal) * 100)),
    ...pick(child.content, locale),
  }));
}

export function getChild(locale: Locale, reference: string): Child | undefined {
  return getChildren(locale).find(
    (child) => child.reference.toLowerCase() === reference.toLowerCase(),
  );
}

export function getChildReferences(): string[] {
  return childSources.map((child) => child.reference.toLowerCase());
}
