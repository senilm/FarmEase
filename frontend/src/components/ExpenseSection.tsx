import { Expense } from "../lib/interfaces";
import ExpenseCard from "./ExpenseCard";
import { Toaster } from "../components/ui/toaster";
import SkeletonLoader from "./SkeletonLoader";

interface ExpenseSectionProps {
  expenses: Expense[];
  refetch: () => void;
  loading: boolean;
}
const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  expenses,
  refetch,
  loading,
}) => {
  return (
    <>
      <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4 px-10">
        {loading ? (
          <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          </>
        ) : expenses.length == 0 ? (
          <div className=" text-center col-span-3">No expenses</div>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard key={expense.id} data={expense} refetch={refetch} />
          ))
        )}
        <Toaster />
      </div>
    </>
  );
};

export default ExpenseSection;
