type ContentProps = {
  title: string;
  para: string;
};

export const TitleAndContent = ({ title, para }: ContentProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="font-semibold md:text-[32px] text-xl text-black">
        {title}
      </h2>
      <p className="text-blackish-green max-w-[851px] w-full">
        {para}
      </p>
    </div>
  );
};
