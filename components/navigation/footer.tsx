import Image from "next/image";
import Logo from '@/public/logos/dark/Logo_dark.svg';
import { FacebookIcon } from "../icons/socials/facebook";
import { TwitterXIcon } from "../icons/socials/twitterX";
import { YouTubeIcon } from "../icons/socials/youtube";
import { InstagramIcon } from "../icons/socials/instagram";

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
    <footer className="w-full relative">
      <div className="lg:w-[77%] lg:h-[305px] h-auto lg:mx-auto px-5 lg:px-0 rounded-[20px] bg-mint-green-50 "></div>
      <div className="absolute top-[151px] w-full lg:h-[422px] h-auto left-0 right-0 bg-mint-green-100 -z-10">
        <div className="mt-[218px] lg:mb-16 lg:w-[77%] lg:mx-auto mb-10 px-5 lg:px-0 flex flex-wrap lg:flex-nowrap lg:justify-between gap-6">
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
                <h4 className="capitalize font-bold mb-4 font-montserrat">
                  {navItem.title}
                </h4>
                {navItem.links.map((link) => (
                  <p
                    key={link}
                    className="font-medium text-xs lg:text-sm font-montserrat"
                  >
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
