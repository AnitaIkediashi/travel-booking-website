import Image from "next/image";
import coverImage from "@/public/authentication/account_cover.png";
import userImage from "@/public/authentication/avatar.png"
import { Button } from "@/components/reusable/button";
import { CloudUploadIcon } from "@/components/icons/cloud_upload";
import { Avatar } from "antd";
import { UserOutlineIcon } from "@/components/icons/user_outline";

type ProfileHeaderProps = {
  name?: string;
  email?: string;
  coverUrl?: string;
  avatarUrl?: string;
  onCoverChange?: (file: File) => void;
  onAvatarChange?: (file: File) => void;
};

export const ProfileHeader = ({}: ProfileHeaderProps) => {
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
      <div className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2">
        <div className="relative size-20 sm:size-28 md:size-36 lg:size-40 border-4 border-salmon-100 rounded-full z-30 flex flex-col items-center justify-center">
          <Avatar
            icon={<UserOutlineIcon className="size-3/4" />}
            className="size-full! rounded-[inherit] inline-flex items-center justify-center"
          />
        </div>
      </div>
    </section>
  );
};
