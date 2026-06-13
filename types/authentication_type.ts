export type StepVerificationProps = {
  searchParams: Promise<StepVerificationSearchParams>;
};

type StepVerificationSearchParams = {
  step?: string;
  email?: string;
};

export type SignUpFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};
