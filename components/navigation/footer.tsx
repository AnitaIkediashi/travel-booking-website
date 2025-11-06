import Image from "next/image";
import Logo from '@/public/logos/dark/Logo_dark.svg';
import { FacebookIcon } from "../icons/socials/facebook";
import { TwitterXIcon } from "../icons/socials/twitterX";
import { YouTubeIcon } from "../icons/socials/youtube";
import { InstagramIcon } from "../icons/socials/instagram";
import { Button } from "../reusable/button";
import MailBox from '@/public/illustrations/emojione-v1_open-mailbox-with-lowered-flag.svg';

const navigationLinks = [
  {
    title: "our destinations",
    links: ["Canada", "Alaska", "France", "Iceland"],
  },
  {
    title: "our activities",
    links: [
      "Northern Lights",
      "Cruising & sailing",
      "Multi-activities",
      "Kayaking",
    ],
  },
  {
    title: "travel blogs",
    links: ["Bali Travel Guide", "Sri Lanks Travel Guide", "Peru Travel Guide"],
  },
  {
    title: "about us",
    links: ["Our Story", "Work with us"],
  },
  {
    title: "contact us",
    links: ["Our Story", "Work with us"],
  },
];


export const Footer = () => {
  return (
    <footer className="w-full relative font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] w-[95%] h-auto mx-auto lg:px-6 px-4 rounded-[20px] bg-mint-green-50 flex lg:items-center lg:justify-between gap-3">
        <div className="flex flex-col my-6 gap-6 lg:max-w-[400px] xl:max-w-[593px]">
          <h3 className="font-bold lg:text-[44px]/[54px] md:text-4xl text-2xl lg:max-w-[364px] lg:h-[108px]">
            Subscribe Newsletter
          </h3>
          <div>
            <h4 className="md:text-xl text-lg font-bold opacity-80 mt-2">
              The Travel
            </h4>
            <p className="font-medium opacity-70 mb-4">
              Get inspired! Receive travel discounts, tips and behind the scenes
              stories.
            </p>
            <div className="flex md:flex-row flex-col gap-4 lg:justify-between w-full md:h-14">
              <div className="lg:w-[300px] md:w-[473px] xl:w-[400px] w-full bg-white md:h-full h-14 rounded-sm md:pl-4 pl-2 py-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full placeholder:text-blackish-green-10 h-full"
                />
              </div>
              <Button
                type="button"
                label="subscribe"
                className="md:h-full h-14 lg:w-[calc(100%-300px)] md:w-[calc(100%-473px)] xl:w-[calc(100%-400px)] w-full flex items-center justify-center bg-blackish-green rounded-sm hover:bg-[rgba(28,27,31,0.8)]"
                labelClassName="text-white text-sm font-semibold capitalize"
              />
            </div>
          </div>
        </div>
        <div className="lg:self-end hidden lg:flex">
          <Image src={MailBox} alt="mail box illustration" />
        </div>
      </div>
      <div className="absolute top-[151px] w-full lg:h-[422px] h-auto left-0 right-0 bg-mint-green-100 -z-10">
        <div className="lg:mt-[218px] md:mt-[146px] mt-[209px] lg:mb-16 lg:w-[77%] md:w-[80%] w-[95%] mx-auto mb-10  flex flex-wrap lg:flex-nowrap lg:justify-between gap-6">
          <div className="flex flex-col gap-6">
            <Image src={Logo} alt="Golobe logo" />
            <div className="flex items-center gap-3">
              <FacebookIcon />
              <TwitterXIcon />
              <YouTubeIcon />
              <InstagramIcon />
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-6">
            {navigationLinks.map((navItem) => (
              <div key={navItem.title}>
                <h4 className="capitalize font-bold mb-4 ">{navItem.title}</h4>
                {navItem.links.map((link) => (
                  <p key={link} className="font-medium text-xs lg:text-sm">
                    {link}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
