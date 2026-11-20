export const VALID_TABS = ["account", "history", "payments"] as const;
export type Tab = (typeof VALID_TABS)[number];

export const TAB_LABELS: Record<Tab, string> = {
  account: "Account",
  history: "History",
  payments: "Payment methods",
};

export const VALID_HISTORY_TYPES = ["flights", "stays"] as const;
export type HistoryType = (typeof VALID_HISTORY_TYPES)[number];
