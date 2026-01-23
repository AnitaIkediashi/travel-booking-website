
type BoxShadowProps = {
    className: string;
    children: React.ReactNode;
}

export const BoxShadow = ({className, children}: BoxShadowProps) => {
  return (
    <div className={`rounded-xl bg-white ${className}`}>{children}</div>
  )
}
