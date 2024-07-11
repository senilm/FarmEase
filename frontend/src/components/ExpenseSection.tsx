import { Expense } from "../lib/interfaces"
import ExpenseCard from "./ExpenseCard"
import { Toaster } from "../components/ui/toaster";

interface ExpenseSectionProps {
    expenses:Expense[],
    refetch:()=>void;
}
const ExpenseSection: React.FC<ExpenseSectionProps> = ({expenses, refetch}) => {
  return (
    <>
    <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4 px-10">
      {expenses.length == 0 ? <div className=" text-center col-span-3">No expenses</div> : expenses.map((expense) => (
        <ExpenseCard key={expense.id} data={expense} refetch={refetch} />
      ))}
     <Toaster/>
    </div>
    </>
  )
}

export default ExpenseSection