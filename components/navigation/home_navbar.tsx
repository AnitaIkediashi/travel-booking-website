import Image from "next/image";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import logo from '@/public/logos/light/Logo_light.svg'
import { Button } from "../reusable/button";


export const HomeNavbar = () => {
  return (
    <section className="mx-[30px] mt-[30px] font-montserrat">
      <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/landing_page/home_bg.png)] bg-no-repeat bg-center bg-cover h-[581px] rounded-3xl relative">
        <header className="px-8 py-[30px]">
          <nav className="flex items-center justify-between text-white">
            <div className="flex items-center gap-8">
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
            <div className="flex items-center gap-8">
              <Button
                label="login"
                className="capitalize text-white text-sm font-semibold"
              />
              <Button label="Sign up" className="text-sm font-semibold px-6 py-[15.5px] rounded-lg bg-white text-blackish-green" />
            </div>
          </nav>
        </header>
      </div>
    </section>
  );
}
