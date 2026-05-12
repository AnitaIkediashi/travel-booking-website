export type ForgotPasswordProps = {
  searchParams: Promise<ForgotPasswordSearchParams>;
};

type ForgotPasswordSearchParams = {
    step: string
}