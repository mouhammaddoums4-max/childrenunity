import { redirect } from "next/navigation";
import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  /* Deja connecte : inutile de redemander un lien. */
  const user = await getSessionUser().catch(() => null);
  if (user) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-brand-50/60 to-canvas px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo-mark.png"
            alt=""
            aria-hidden="true"
            width={739}
            height={618}
            priority
            className="h-16 w-auto"
          />
          <h1 className="font-display mt-6 text-2xl font-bold text-navy">
            Administration
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Children&apos;s Unity Foundation
          </p>
        </div>

        <div className="mt-9 rounded-3xl border border-line bg-white p-7 shadow-lift sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-muted">
          L&apos;accès est réservé aux mentors, coordinateurs et administrateurs
          de la fondation. Aucun mot de passe n&apos;est conservé : vous recevez
          un lien valable quinze minutes.
        </p>
      </div>
    </main>
  );
}
