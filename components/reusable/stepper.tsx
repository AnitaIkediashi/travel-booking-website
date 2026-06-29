import { STEP_LABELS } from "@/utils/stepper_variables";

type StepperProps = {
    current: number
}

export const Stepper = ({ current }: StepperProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-8">
      {STEP_LABELS.map((label, index) => (
        <div
          key={label}
          className="flex flex-col md:flex-row items-start md:items-center flex-1 last:flex-none"
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  index < current
                    ? "bg-blackish-green text-white"
                    : index === current
                      ? "bg-blackish-green text-white ring-2 ring-blackish-green/30"
                      : "bg-gray-200 text-gray-500"
                }`}
            >
              {index < current ? "✓" : index + 1}
            </div>
            <span className="text-xs mt-1.5 font-medium text-center w-24">
              {label}
            </span>
          </div>
          {index < STEP_LABELS.length - 1 && (
            <div
              className={`md:flex-1 md:mx-2 mx-[45px] self-auto my-4 md:my-0
                w-0.5 h-8 md:w-auto md:h-0.5 ${
                  index < current ? "bg-blackish-green" : "bg-gray-200"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
