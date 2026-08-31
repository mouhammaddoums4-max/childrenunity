"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  ReceiptText,
  GraduationCap,
  HeartHandshake,
  Images,
  LayoutDashboard,
  ScrollText,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* Les icones sont des composants : elles vivent ici, du cote client, et le
   serveur ne transmet que la liste des adresses autorisees pour le role. */
const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/children", label: "Enfants", icon: GraduationCap },
  { href: "/admin/reports", label: "Rapports de suivi", icon: ScrollText },
  { href: "/admin/sponsorships", label: "Parrainages", icon: HeartHandshake },
  { href: "/admin/payments", label: "Encaissements", icon: Banknote },
  { href: "/admin/expenses", label: "Dépenses", icon: ReceiptText },
  { href: "/admin/members", label: "Membres", icon: UsersRound },
  { href: "/admin/gallery", label: "Galerie", icon: Images },
  { href: "/admin/users", label: "Comptes", icon: Users },
];

export function AdminNav({ allowed }: { allowed: string[] }) {
  const pathname = usePathname() ?? "/admin";

  return (
    <nav aria-label="Sections de l'administration" className="flex-1 p-3">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items
          .filter((item) => allowed.includes(item.href))
          .map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
