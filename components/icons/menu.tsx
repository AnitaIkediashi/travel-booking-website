import { IconProps } from "@/prop_types/types";


export const MenuIcon = ({fillColor}: IconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 24 24"
      fill={fillColor || "#000000"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g id="Menu / Menu_Duo_LG">
          {" "}
          <path
            id="Vector"
            d="M3 15H21M3 9H21"
            stroke={fillColor || "#000000"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
