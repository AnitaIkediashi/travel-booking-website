import Image from "next/image";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import logo from '@/public/logos/light/Logo_light.svg'
import { Button } from "../reusable/button";
import { MobileMenu } from "./mobile_menu";


export const HomeNavbar = () => {
  return (
    <section className="md:mx-[30px] md:mt-[30px] mx-3 mt-4 font-montserrat">
      <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/landing_page/home_bg.png)] bg-no-repeat bg-center bg-cover h-[581px] rounded-3xl relative">
        <header className="px-8 py-[30px]">
          <nav className="flex items-center justify-between text-white">
            <div className="lg:flex items-center gap-8 hidden">
              <div className="flex items-center gap-[3.5px]">
                <FlightIcon fillColor="white" />
                <span className="capitalize text-sm font-semibold">
                  find flight
                </span>
              </div>
              <div className="flex items-center gap-[3.5px]">
                <BedIcon fillColor="white" />
                <span className="capitalize text-sm font-semibold">
                  find stays
                </span>
              </div>
            </div>
            <Image src={logo} alt="company logo" />
            <div className="lg:flex items-center gap-8 hidden">
              <Button
                label="login"
                className="capitalize text-white text-sm font-semibold"
              />
              <Button label="Sign up" className="text-sm font-semibold px-6 py-[15.5px] rounded-lg bg-white text-blackish-green" />
            </div>
            <MobileMenu />
          </nav>
        </header>
      </div>
    </section>
  );
}
