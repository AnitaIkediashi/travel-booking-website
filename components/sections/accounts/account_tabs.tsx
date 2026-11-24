import Link from "next/link";

type Item = { id: string; label: string; href: string };

export const AccountTabs = ({ items, active }: { items: Item[]; active: string }) => (
  <nav
    role="tablist"
    className="flex w-full rounded-xl bg-white shadow-light items-center mb-10 mt-[117px]"
  >
    {items.map((item) => {
      const isActive = item.id === active;
      return (
        <Link
          key={item.id}
          href={item.href}
          replace
          scroll={false}
          role="tab"
          aria-selected={isActive}
          className={`relative flex flex-1 items-center justify-center self-stretch gap-2 px-3 py-2 text-center text-xs font-semibold md:items-start md:justify-start md:px-6 md:py-4 md:text-left md:text-sm lg:text-base
    after:absolute after:right-0 after:top-1/2 after:h-6 after:w-px after:-translate-y-1/2 after:bg-mint-green-70 last:after:hidden
    ${
      isActive
        ? "before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-4/5 before:-translate-x-1/2 before:bg-mint-green-100 md:before:left-6 md:before:w-[100px] md:before:translate-x-0"
        : ""
    }`}
        >
          {item.label}
        </Link>
      );
    })}
  </nav>
);
