import { organisation } from "@/lib/content";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const entries = [
  { key: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { key: "linkedin", Icon: LinkedinIcon, label: "LinkedIn" },
  { key: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { key: "youtube", Icon: YoutubeIcon, label: "YouTube" },
] as const;

/**
 * Barre de reseaux sociaux flottante, ancree a gauche de l'ecran.
 * Masquee sous 1280px : sur mobile, les memes liens restent accessibles
 * dans le pied de page, sans empieter sur la lecture.
 */
export function SocialRail({ label }: { label: string }) {
  const links = entries
    .map((entry) => ({ ...entry, href: organisation.social[entry.key] }))
    .filter((entry): entry is typeof entry & { href: string } =>
      Boolean(entry.href),
    );

  if (links.length === 0) return null;

  return (
    <div className="fixed top-1/2 left-3 z-30 hidden -translate-y-1/2 xl:block">
      <ul
        aria-label={label}
        className="flex flex-col gap-1 rounded-full border border-line bg-white/90 p-1.5 shadow-lift backdrop-blur-md"
      >
        {links.map(({ key, href, Icon, label: name }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={name}
              title={name}
              className="flex size-11 items-center justify-center rounded-full text-navy transition-colors duration-200 hover:bg-brand hover:text-white"
            >
              <Icon className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
