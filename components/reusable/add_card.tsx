import { AddWithCircle } from "../icons/add_with_circle";

type AddCardProps = {
  onClick: () => void;
}
export const AddCard = ({ onClick }: AddCardProps) => {

  return <div className="w-full h-[188.83px] border-dashed border-2 border-mint-green-100 rounded-[15px] flex items-center justify-center cursor-pointer font-montserrat" onClick={onClick}>
    <div className="flex items-center justify-center flex-col gap-2.5">
        <AddWithCircle />
      <small className="font-medium text-xs opacity-75">Add a new card</small>
    </div>
  </div>;
};
