"use client";

import Barcode from "react-barcode";

export const BarcodeDisplay = ({ value }: { value: string }) => {
  if (!value) return null;

  return (
    <Barcode
      value={value}
      width={1}
      height={49}
      displayValue={false}
      background="transparent"
      className="barcode"

    
    />
  );
};
