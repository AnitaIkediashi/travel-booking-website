import { HistoryType } from "@/types/account_type";


export const HistoryPanel = async ({ type }: { type: HistoryType }) => {
    const items = [
      {
        id: "flights",
        label: "Flights",
        href: "/account?tab=history&type=flights",
      },
      { id: "stays", label: "Stays", href: "/account?tab=history&type=stays" },
    ];
  return <div>history_panel</div>;
};
