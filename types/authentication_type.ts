export type StepVerificationProps = {
  searchParams: Promise<StepVerificationSearchParams>;
};

type StepVerificationSearchParams = {
  step: string;
};

export type SignUpFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};
