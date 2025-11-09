
type CustomRadioTagProps = {
    outerCircleClassName: string;
    innerCircleClassName: string;
    selected: string;
    label: string;
    value: string;
    onClick: (value: string) => void;
}

export const CustomRadioTag = ({
  selected,
  label,
  value,
  onClick,
  outerCircleClassName,
  innerCircleClassName
}: CustomRadioTagProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="cursor-pointer" onClick={() => onClick(value)}>
        {/* outer circle */}
        <div
          className={`w-6 h-6 rounded-full border  flex justify-center items-center transition-all ${
            value === selected ? outerCircleClassName : "border-gray-10"
          }`}
        >
          {/* inner circle */}
          <div
            className={`rounded-full transition-all ${innerCircleClassName} ${
              value === selected ? "w-3 h-3" : "w-0 h-0"
            }`}
          />
        </div>
      </div>
      <span className="text-blackish-green text-sm font-medium">{label}</span>
    </div>
  );
};
