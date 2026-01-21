
type TitleProps = {
    title: string
}

export const FilterTitle = ({title}: TitleProps) => {
  return (
    <h5 className="text-blackish-green font-semibold capitalize mb-4">
      {title}
    </h5>
  );
}
