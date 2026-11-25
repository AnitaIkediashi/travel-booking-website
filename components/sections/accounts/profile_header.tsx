'use client'

import Image from "next/image";
import coverImage from "@/public/authentication/account_cover.png";
import { Button } from "@/components/reusable/button";
import { CloudUploadIcon } from "@/components/icons/cloud_upload";
import { Avatar } from "antd";
import { UserOutlineIcon } from "@/components/icons/user_outline";
import { PenIcon } from "@/components/icons/pen";
import { useCurrentUser } from "@/lib/auth-context";

type ProfileHeaderProps = {
  name?: string;
  email?: string;
  coverUrl?: string;
  avatarUrl?: string;
  onCoverChange?: (file: File) => void;
  onAvatarChange?: (file: File) => void;
};

export const ProfileHeader = ({}: ProfileHeaderProps) => {
  const { user } = useCurrentUser();
  return (
    <section className="w-full relative">
      <div className="lg:h-[350ppx] md:h-[280px] sm:h-60 h-48 w-full relative rounded-xl">
        <Image
          src={coverImage}
          alt="user cover image"
          loading="eager"
          className="w-full h-full object-cover rounded-[inherit]"
        />
        {/* 768 pixels upwards - button view */}
        <Button
          label="Upload new cover"
          icon={<CloudUploadIcon />}
          className="hidden md:flex items-center justify-center gap-1 h-12 px-4 text-sm bg-mint-green-100 text-black absolute right-6 md:bottom-6 z-30 hover:bg-blackish-green hover:text-white
        disabled:opacity-60 disabled:cursor-not-allowed"
          labelClassName="font-medium"
        />
        {/* mobile screens - button view */}
        <Button
          icon={<CloudUploadIcon />}
          className="flex md:hidden items-center justify-center gap-1 h-10 w-10 text-sm rounded bg-mint-green-100 text-black absolute right-6 bottom-6 z-30 hover:bg-blackish-green hover:text-white
        disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 md:-bottom-[156px] -bottom-[102px] flex flex-col items-center justify-center">
        <div className="relative size-20 sm:size-28 md:size-36 lg:size-40 border-4 border-salmon-100 rounded-full z-30 ">
          <Avatar
            icon={<UserOutlineIcon className="size-3/4" />}
            className="size-full! rounded-[inherit] inline-flex items-center justify-center"
          />
          <Button
            icon={<PenIcon className="w-3 h-3 md:w-auto md:h-auto" />}
            className="md:w-11 md:h-11 sm:h-7 sm:w-7 w-5 h-5 rounded-full flex items-center justify-center absolute bottom-0 right-0 bg-salmon-100 z-20 hover:bg-black hover:text-salmon-100  disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        {/* user info */}
        <div className="text-center mt-4 md:mt-6">
          <h4 className="md:text-2xl text-lg font-semibold">
            {!user?.name ? "Guest" : user.name}
          </h4>
          <p className="text-sm md:text-base opacity-75">
            {!user?.email ? "N/A" : user.email}
          </p>
        </div>
      </div>
    </section>
  );
};
