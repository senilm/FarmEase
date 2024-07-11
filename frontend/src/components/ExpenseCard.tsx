import { formatDate } from "../lib/dateFormat";
import { Expense } from "../lib/interfaces";
import DeleteExpenseModal from "./DeleteExpenseModal";

interface ExpenseCardProps {
  data: Expense;
  refetch:()=>void
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ data, refetch }) => {
  return (
    <div className="border px-4 py-3 rounded-lg mb-2 bg-white shadow-lg">
      <div className=" flex justify-between ">
        <p className=" font-bold text-red-500 text-xl">₹{data.amount}</p>
        <p>{formatDate(data.date.toString())}</p>
      </div>
      <div className=" flex justify-between mt-2">
        <p className="">{data.note}</p>
        <DeleteExpenseModal id={data.id} refetch={refetch}/>
      </div>
    </div>
  );
};

export default ExpenseCard;
