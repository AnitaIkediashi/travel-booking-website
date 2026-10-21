import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

type ButtonProps = {
  className: string;
  label?: string;
  labelClassName?: string;
  iconClassName?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  href?: Url;
  disabled?: boolean;
  "aria-label"?: string | undefined;
  "aria-pressed"?: boolean | "true" | "false" | "mixed" | undefined;
};

export const Button = ({
  type,
  label,
  className,
  labelClassName,
  iconClassName,
  onClick,
  icon,
  href,
  disabled,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed
}: ButtonProps) => {
  return !href ? (
    <button
      type={type}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {icon && <span className={iconClassName}>{icon}</span>}{" "}
      {label && <span className={labelClassName}>{label}</span>}
    </button>
  ) : (
    <Link href={href as Url} className={className}>
      {icon && <span className={iconClassName}>{icon}</span>}{" "}
      {label && <span className={labelClassName}>{label}</span>}
    </Link>
  );
};
