import { Fragment } from "react";

type StepperProps = {
  current: number;
  labels: string[];
};

export const Stepper = ({ current, labels }: StepperProps) => {
  return (
    <div className="flex items-start w-full mb-8">
      {labels.map((label, index) => (
        <Fragment key={index}>
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
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

          {index < labels.length - 1 && (
            <div
              className={`flex-1 min-w-3 h-0.5 mt-4 mx-1 sm:mx-2 ${
                index < current ? "bg-blackish-green" : "bg-gray-200"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};
