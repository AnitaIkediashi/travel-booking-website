'use client'

import { useState } from "react";
import { AddCard } from "./add_card"
import { CreateCardForm } from "../modals/create_card_form";

export const CardDetails = () => {
  const [showCardForm, setShowCardForm] = useState(false)

  const handleOpenCardForm = () => {
    setShowCardForm(true)
  }

  const handleCloseCardForm = () => {
    setShowCardForm(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-4 font-montserrat">
        <div className="w-full h-20 flex items-center justify-between bg-mint-green-100 rounded-xl p-4">
          {/* card info */}
          <div className="flex items-center gap-8">
            {/* card type, last 4 digits, expiry date */}
          </div>
          {/* radio button */}
        </div>
        <AddCard onClick={handleOpenCardForm} />
      </div>
      <CreateCardForm
        showCardForm={showCardForm}
        onClose={handleCloseCardForm}
      />
    </>
  );
}
