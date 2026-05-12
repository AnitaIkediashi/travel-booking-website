export type ForgotPasswordProps = {
  searchParams: Promise<ForgotPasswordSearchParams>;
};

type ForgotPasswordSearchParams = {
    verify: string
}