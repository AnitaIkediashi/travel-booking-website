'use client'
import { useState } from "react";
import { MenuIcon } from "../icons/menu"

export const MobileMenu = () => {
    const [showMenu, setShowMenu] = useState(false)
  return (
    <div className="relative block lg:hidden">
      <div className="cursor-pointer">
        <MenuIcon fillColor="#fff" />
      </div>
      <div className="absolute bg-white h-[400px] w-[332px] rounded-lg right-0"></div>
    </div>
  );
}
