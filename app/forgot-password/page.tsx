import { ForgotPasswordWrapper } from "@/components/registration/forgot_password_wrapper"
import { ImageCarouselWrapper } from "@/components/registration/image_carousel_wrapper"
import { ResetPasswordWrapper } from "@/components/registration/reset_password_wrapper"
import { VerifyPasswordWrapper } from "@/components/registration/verify_password_wrapper"
import { ForgotPasswordProps } from "@/types/authentication_type"


const ForgotPasswordPage = async ({searchParams}: ForgotPasswordProps) => {
  const forgotPasswordSearchProps = await searchParams
  const request = forgotPasswordSearchProps.step
  return (
    <section className="w-full min-h-screen flex items-center justify-center font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] w-full mx-auto px-8 md:px-0 pt-8 pb-4 sm:pb-0 sm:pt-0 lg:h-[calc(100vh-64px)]">
        <div className="w-full flex gap-[104px] h-full">
          {request === "verify-password" ? (
            <VerifyPasswordWrapper />
          ) : request === "reset-password" ? (
            <ResetPasswordWrapper />
          ) : (
            <ForgotPasswordWrapper />
          )}
          <ImageCarouselWrapper />
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage