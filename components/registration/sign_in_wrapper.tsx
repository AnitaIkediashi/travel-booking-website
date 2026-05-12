
import { ImageCarouselWrapper } from "./image_carousel_wrapper";
import { SignInForm } from "./sign_in_form";

export const SignInWrapper = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] w-full mx-auto px-8 md:px-0 pt-8 sm:pt-0 lg:h-[calc(100vh-64px)]">
        <div className="w-full flex gap-[104px] h-full">
          <SignInForm />
          <ImageCarouselWrapper />
        </div>
      </div>
    </section>
  );
}
