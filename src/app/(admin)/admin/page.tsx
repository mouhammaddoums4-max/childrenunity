import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  ScrollText,
  UsersRound,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import {
  getDashboard,
  placementLabels,
  purposeLabels,
} from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/shell";
import { StatCard } from "@/components/admin/stat-card";
import { Panel } from "@/components/admin/panel";

export const metadata = { title: "Tableau de bord" };
/* Des chiffres de gestion n'ont aucun intérêt à être mis en cache. */
export const dynamic = "force-dynamic";

const gnf = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "GNF",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function DashboardPage() {
  if (!hasDatabase) redirect("/admin/login");

  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const data = await getDashboard(user);
  const canSeeMoney = user.role === "ADMIN" || user.role === "COORDINATOR";
  const totalPlacements = data.placements.reduce((sum, p) => sum + p.count, 0);

  const firstName = user.fullName.split(" ")[0];

  return (
    <AdminShell
      user={user}
      title={`Bonjour ${firstName}`}
      description="Voici l'état des dossiers et des encaissements aujourd'hui."
    >
      {/* Chiffres clés */}
      <section>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StatCard
              label="Enfants accompagnés"
              value={data.children.active}
              hint={`${data.children.openToSponsors} ouverts au parrainage`}
              icon={GraduationCap}
              accent="brand"
              href="/admin/children"
            />
          </li>
          <li>
            <StatCard
              label="Dossiers à valider"
              value={data.children.pendingReview}
              hint={
                data.children.pendingReview > 0
                  ? "En attente de votre relecture"
                  : "Rien en attente"
              }
              icon={ClipboardCheck}
              accent={data.children.pendingReview > 0 ? "orange" : "teal"}
              href="/admin/children?status=PENDING_REVIEW"
            />
          </li>

          {canSeeMoney ? (
            <>
              <li>
                <StatCard
                  label="Encaissé ce mois"
                  value={gnf.format(data.money.confirmedThisMonthGnf)}
                  hint="Versements confirmés"
                  icon={Banknote}
                  accent="teal"
                  href="/admin/payments"
                />
              </li>
              <li>
                <StatCard
                  label="À rapprocher"
                  value={data.money.pendingCount}
                  hint={gnf.format(data.money.pendingGnf)}
                  icon={HeartHandshake}
                  accent={data.money.pendingCount > 0 ? "orange" : "teal"}
                  href="/admin/payments?status=PENDING"
                />
              </li>
            </>
          ) : (
            <li className="sm:col-span-2">
              <StatCard
                label="Rapports déposés"
                value={data.recentReports.length}
                hint="Vos derniers comptes rendus"
                icon={ScrollText}
                accent="teal"
                href="/admin/reports"
              />
            </li>
          )}
        </ul>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Orientation des enfants */}
          <Panel
            title="Orientation des enfants"
            description="Répartition des placements en cours."
          >
            {totalPlacements === 0 ? (
              <p className="text-sm text-ink-muted">
                Aucun placement en cours pour le moment.
              </p>
            ) : (
              <ul className="space-y-5">
                {data.placements
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .map((placement) => {
                    const share = Math.round(
                      (placement.count / totalPlacements) * 100,
                    );
                    return (
                      <li key={placement.kind}>
                        <div className="flex items-baseline justify-between gap-4 text-sm">
                          <span className="font-medium text-navy">
                            {placementLabels[placement.kind] ?? placement.kind}
                          </span>
                          <span className="tabular-nums text-ink-muted">
                            {placement.count}{" "}
                            <span className="text-ink-muted/70">({share} %)</span>
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-canvas">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </Panel>

          {/* Derniers rapports */}
          <Panel
            title="Derniers rapports de suivi"
            action={{ href: "/admin/reports", label: "Tous les rapports" }}
          >
            {data.recentReports.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Aucun rapport déposé pour l&apos;instant.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {data.recentReports.map((report) => (
                  <li key={report.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-display font-semibold text-navy">
                        {report.childName}{" "}
                        <span className="font-sans text-xs font-normal tabular-nums text-ink-muted">
                          {report.childReference}
                        </span>
                      </p>
                      <time
                        dateTime={report.periodEnd.toISOString()}
                        className="text-xs text-ink-muted"
                      >
                        {shortDate.format(report.periodEnd)}
                      </time>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">
                      {report.summary}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted/80">
                      par {report.authorName}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Dossiers en attente */}
          <Panel
            title="Dossiers à valider"
            action={{ href: "/admin/children", label: "Voir tout" }}
          >
            {data.awaitingReview.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Aucun dossier n&apos;attend de relecture.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.awaitingReview.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/admin/children/${child.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 transition-colors duration-150 hover:border-brand/40 hover:bg-brand-50/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-navy">
                          {child.publicName}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {child.city}, {child.country} · {child.reference}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Versements à rapprocher */}
          {canSeeMoney ? (
            <Panel
              title="Versements à rapprocher"
              action={{ href: "/admin/payments", label: "Voir tout" }}
            >
              {data.pendingPayments.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  Tous les versements annoncés ont été retrouvés.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {data.pendingPayments.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="min-w-0">
                        <span className="font-display block truncate text-sm font-bold tabular-nums text-navy">
                          {payment.reference}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {purposeLabels[payment.purpose] ?? payment.purpose}
                          {payment.payerName ? ` · ${payment.payerName}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-navy">
                        {gnf.format(payment.amountGnf)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          ) : null}

          {/* Membres */}
          {canSeeMoney ? (
            <Panel title="Membres">
              <dl className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-canvas p-4">
                  <dt className="text-xs text-ink-muted">À jour</dt>
                  <dd className="font-display mt-1 text-2xl font-bold tabular-nums text-navy">
                    {data.members.active}
                  </dd>
                </div>
                <div className="rounded-2xl bg-canvas p-4">
                  <dt className="text-xs text-ink-muted">En attente</dt>
                  <dd className="font-display mt-1 text-2xl font-bold tabular-nums text-navy">
                    {data.members.pending}
                  </dd>
                </div>
              </dl>
              <Link
                href="/admin/members"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
              >
                <UsersRound className="size-4" aria-hidden="true" />
                Gérer les membres
              </Link>
            </Panel>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
