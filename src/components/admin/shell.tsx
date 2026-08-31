import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { can, destroySession, type Permission, type SessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/nav";

/** Sections de l'administration, avec le droit qu'elles exigent. */
const sections: { href: string; permission?: Permission }[] = [
  { href: "/admin" },
  { href: "/admin/children" },
  { href: "/admin/reports" },
  { href: "/admin/sponsorships", permission: "reviewChildren" },
  { href: "/admin/payments", permission: "confirmPayments" },
  { href: "/admin/expenses", permission: "manageExpenses" },
  { href: "/admin/members", permission: "manageMembers" },
  { href: "/admin/gallery", permission: "manageGallery" },
  { href: "/admin/users", permission: "manageUsers" },
];

const roleLabels: Record<SessionUser["role"], string> = {
  ADMIN: "Administrateur",
  COORDINATOR: "Coordination",
  FINANCE: "Finances",
  MENTOR: "Mentor",
  VIEWER: "Lecture seule",
};

async function signOut() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

/**
 * Cadre commun de l'administration : barre latérale, identité de la
 * personne connectée, et zone de contenu. Les entrées de menu que le rôle
 * ne permet pas ne sont pas affichées — un mentor ne voit ni les
 * encaissements, ni les comptes.
 */
export function AdminShell({
  user,
  title,
  description,
  actions,
  children,
}: {
  user: SessionUser;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const allowed = sections
    .filter((section) => !section.permission || can(user.role, section.permission))
    .map((section) => section.href);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Barre latérale */}
      <aside className="shrink-0 border-b border-line bg-navy text-white lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col">
          <Link
            href="/admin"
            className="flex items-center gap-3 border-b border-white/10 px-5 py-5"
          >
            <Image
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width={739}
              height={618}
              className="h-9 w-auto"
            />
            <span className="leading-tight">
              <span className="font-display block text-sm font-bold">
                Administration
              </span>
              <span className="text-[11px] tracking-[0.16em] text-white/50 uppercase">
                Foundation
              </span>
            </span>
          </Link>

          <AdminNav allowed={allowed} />

          <div className="mt-auto border-t border-white/10 p-4">
            <p className="font-display truncate text-sm font-semibold">
              {user.fullName}
            </p>
            <p className="mt-0.5 truncate text-xs text-white/60">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {roleLabels[user.role]}
            </span>

            <form action={signOut} className="mt-4">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        <header className="border-b border-line bg-white px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
              ) : null}
            </div>
            {actions}
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
