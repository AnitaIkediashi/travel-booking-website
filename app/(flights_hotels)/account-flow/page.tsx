import { AccountPanel } from "@/components/sections/accounts/account_panel";
import { AccountTabs } from "@/components/sections/accounts/account_tabs";
import { HistoryPanel } from "@/components/sections/accounts/history_panel";
import { PaymentsPanel } from "@/components/sections/accounts/payments_panel";
import { ProfileHeader } from "@/components/sections/accounts/profile_header";
import { HistoryType, Tab, TAB_LABELS, VALID_HISTORY_TYPES, VALID_TABS } from "@/types/account_type";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AccountPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; type?: string }>;
}) => {
  const { tab, type } = await searchParams;

  if (!VALID_TABS.includes(tab as Tab)) redirect("/account-flow?tab=account");

  const activeTab = tab as Tab;

  const historyType: HistoryType = VALID_HISTORY_TYPES.includes(
    type as HistoryType,
  )
    ? (type as HistoryType)
    : "flights";

  const items = VALID_TABS.map((id) => ({
    id,
    label: TAB_LABELS[id],
    href: `/account-flow?tab=${id}`,
  }));
  return (
    <div className="h-auto lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0 pt-[115px] font-montserrat">
      <ProfileHeader />
      <AccountTabs items={items} active={activeTab} />
      <Suspense
        key={`${activeTab}-${historyType}`}
        fallback={<div>Loading…</div>}
      >
        {activeTab === "account" && <AccountPanel />}
        {activeTab === "history" && <HistoryPanel type={historyType} />}
        {activeTab === "payments" && <PaymentsPanel />}
      </Suspense>
    </div>
  );
};

export default AccountPage