import { AddPaymentWrapper } from "@/components/registration/add_payment_wrapper";
import { ImageCarouselWrapper } from "@/components/registration/image_carousel_wrapper";
import { SignUpWrapper } from "@/components/registration/sign_up_wrapper";
import { StepVerificationProps } from "@/types/authentication_type";

const SignUpPage = async ({searchParams}: StepVerificationProps) => {
  const signUpProps = await searchParams
  const request = signUpProps.step
  return (
    <section className="w-full min-h-screen flex items-center justify-center font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] w-full mx-auto px-8 md:px-0 pt-8 pb-4 sm:pb-0 sm:pt-0 lg:h-[calc(100vh-64px)]">
        <div className="w-full flex gap-[104px] h-full">
          <ImageCarouselWrapper type="signup" />
          {request === "add-payment" ? (
            <AddPaymentWrapper />
          ) : (
            <SignUpWrapper />
          )}
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
