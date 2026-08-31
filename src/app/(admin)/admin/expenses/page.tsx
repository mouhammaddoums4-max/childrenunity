import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardCheck,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { can, getSessionUser } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import {
  expenseCategoryLabels,
  expenseStatusLabels,
  getBalance,
  getExpenseSummary,
  getExpenses,
} from "@/lib/admin/expenses";
import { AdminShell } from "@/components/admin/shell";
import { StatCard } from "@/components/admin/stat-card";
import { Panel } from "@/components/admin/panel";
import { cn } from "@/lib/cn";

export const metadata = { title: "Dépenses" };
export const dynamic = "force-dynamic";

const gnf = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "GNF",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/* Teintes de statut : la couleur double toujours un mot, jamais l'inverse. */
const statusStyles: Record<string, string> = {
  DRAFT: "bg-canvas text-ink-muted",
  SUBMITTED: "bg-orange-50 text-orange-ink",
  APPROVED: "bg-brand-50 text-brand",
  PAID: "bg-teal-50 text-teal-ink",
  REJECTED: "bg-red-50 text-red-700",
};

export default async function ExpensesPage() {
  if (!hasDatabase) redirect("/admin/login");

  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!can(user.role, "manageExpenses")) redirect("/admin");

  const [summary, expenses, balance] = await Promise.all([
    getExpenseSummary(),
    getExpenses(),
    getBalance(),
  ]);

  const remaining = balance.receivedThisYearGnf - balance.spentThisYearGnf;
  const totalByCategory = summary.byCategory.reduce(
    (sum, row) => sum + row.amountGnf,
    0,
  );

  return (
    <AdminShell
      user={user}
      title="Dépenses"
      description="Ce que les activités de la fondation ont coûté, et ce qui reste à valider."
    >
      <section>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li>
            <StatCard
              label="Dépensé ce mois"
              value={gnf.format(summary.committedThisMonthGnf)}
              hint="Dépenses validées ou réglées"
              icon={ReceiptText}
              accent="brand"
            />
          </li>
          <li>
            <StatCard
              label="Dépensé cette année"
              value={gnf.format(summary.committedThisYearGnf)}
              hint="Cumul depuis janvier"
              icon={ArrowDownRight}
              accent="orange"
            />
          </li>
          <li>
            <StatCard
              label="À valider"
              value={summary.awaitingApproval}
              hint={gnf.format(summary.awaitingApprovalGnf)}
              icon={ClipboardCheck}
              accent={summary.awaitingApproval > 0 ? "orange" : "teal"}
            />
          </li>
          <li>
            <StatCard
              label="Reçu cette année"
              value={gnf.format(balance.receivedThisYearGnf)}
              hint="Versements confirmés"
              icon={ArrowUpRight}
              accent="teal"
            />
          </li>
        </ul>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <div className="space-y-6">
          {/* Solde */}
          <Panel
            title="Situation de l'année"
            description="Versements confirmés, moins les dépenses engagées."
          >
            <dl className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-muted">Reçu</dt>
                <dd className="font-display font-bold tabular-nums text-teal-ink">
                  {gnf.format(balance.receivedThisYearGnf)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-muted">Dépensé</dt>
                <dd className="font-display font-bold tabular-nums text-orange-ink">
                  −&nbsp;{gnf.format(balance.spentThisYearGnf)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <dt className="font-semibold text-navy">Disponible</dt>
                <dd
                  className={cn(
                    "font-display text-xl font-extrabold tabular-nums",
                    remaining < 0 ? "text-red-600" : "text-navy",
                  )}
                >
                  {gnf.format(remaining)}
                </dd>
              </div>
            </dl>

            {remaining < 0 ? (
              <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-relaxed text-red-700">
                Les dépenses engagées dépassent les versements confirmés. Vérifiez
                les rapprochements avant d&apos;engager de nouvelles dépenses.
              </p>
            ) : null}
          </Panel>

          {/* Répartition */}
          <Panel
            title="Par poste"
            description="Dépenses engagées depuis janvier."
          >
            {summary.byCategory.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Aucune dépense enregistrée cette année.
              </p>
            ) : (
              <ul className="space-y-4">
                {summary.byCategory.map((row) => {
                  const share = totalByCategory
                    ? Math.round((row.amountGnf / totalByCategory) * 100)
                    : 0;
                  return (
                    <li key={row.category}>
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="font-medium text-navy">
                          {expenseCategoryLabels[row.category]}
                        </span>
                        <span className="tabular-nums text-ink-muted">
                          {gnf.format(row.amountGnf)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
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
        </div>

        {/* Journal des dépenses */}
        <Panel
          title="Dernières dépenses"
          description={
            expenses.length > 0
              ? `${expenses.length} dépense${expenses.length > 1 ? "s" : ""} enregistrée${expenses.length > 1 ? "s" : ""}.`
              : undefined
          }
        >
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50">
                <Wallet className="size-6 text-brand" aria-hidden="true" />
              </span>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
                Aucune dépense enregistrée. Les frais de scolarité, la cantine,
                les fournitures et les indemnités des mentors se saisissent ici,
                puis se rattachent à une activité ou à un enfant.
              </p>
            </div>
          ) : (
            /* Le tableau défile seul plutôt que d'élargir la page. */
            <div className="-mx-6 overflow-x-auto sm:-mx-7">
              <table className="w-full min-w-[56rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs tracking-wide text-ink-muted uppercase">
                    <th
                      scope="col"
                      className="w-[22rem] px-6 pb-3 font-semibold sm:px-7"
                    >
                      Dépense
                    </th>
                    <th scope="col" className="px-3 pb-3 font-semibold">
                      Poste
                    </th>
                    <th scope="col" className="px-3 pb-3 font-semibold">
                      Rattachement
                    </th>
                    <th scope="col" className="px-3 pb-3 font-semibold">
                      Date
                    </th>
                    <th scope="col" className="px-3 pb-3 text-right font-semibold">
                      Montant
                    </th>
                    <th scope="col" className="px-6 pb-3 font-semibold sm:px-7">
                      État
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 sm:px-7">
                        <span className="block font-semibold text-navy">
                          {expense.label}
                        </span>
                        <span className="block text-xs text-ink-muted">
                          <span className="tabular-nums whitespace-nowrap">
                            {expense.reference}
                          </span>
                          {expense.supplier ? ` · ${expense.supplier}` : ""}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-ink-muted">
                        {expenseCategoryLabels[expense.category]}
                      </td>
                      <td className="px-3 py-4 text-ink-muted">
                        {expense.projectTitle ?? expense.childName ?? "—"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-ink-muted">
                        {shortDate.format(expense.spentAt)}
                      </td>
                      <td className="px-3 py-4 text-right font-semibold whitespace-nowrap tabular-nums text-navy">
                        {gnf.format(expense.amountGnf)}
                      </td>
                      <td className="px-6 py-4 sm:px-7">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                            statusStyles[expense.status],
                          )}
                        >
                          {expenseStatusLabels[expense.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
