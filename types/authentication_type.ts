export type StepVerificationProps = {
  searchParams: Promise<StepVerificationSearchParams>;
};

type StepVerificationSearchParams = {
    step: string
}