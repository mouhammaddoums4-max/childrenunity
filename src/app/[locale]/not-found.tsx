import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { Arcs } from "@/components/ui/arcs";

/* Le segment de langue n'est pas lisible depuis une page 404 :
   on retombe sur la langue par defaut du site. */
export default function NotFound() {
  const dictionary = getDictionary(defaultLocale);

  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <Arcs className="w-64 opacity-70" />
      <p className="font-display mt-8 text-6xl font-extrabold text-brand">404</p>
      <h1 className="font-display mt-4 text-3xl font-bold text-navy">
        {dictionary.notFound.title}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
        {dictionary.notFound.body}
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-9 inline-flex min-h-12 items-center rounded-full bg-brand px-7 font-semibold text-white transition-colors duration-200 hover:bg-brand-600"
      >
        {dictionary.common.backHome}
      </Link>
    </Container>
  );
}
