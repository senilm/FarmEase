interface DashboardFeedItemProps {
  amount: number;
  type: string;
  date: string;
  text:string;
}
const DashboardFeedItem: React.FC<DashboardFeedItemProps> = ({
  amount,
  type,
  date,
  text
}) => {
  const typeStyles =
    type === "Income"
      ? "text-green-600"
      : type === "Expense"
      ? "text-red-600"
      : "";
  const bgStyles =
    type === "Income" ? "bg-green-50" : type === "Expense" ? "bg-red-50" : "";
  const sign = type === "Income" ? "+" : "-";
  return (
    <div className={` border p-3 rounded-lg flex justify-between ${bgStyles} shadow-sm items-center`}>
      <div className={`font-semibold ${typeStyles} min-w-[22%] md:min-w-[20%]`}>
        {sign}
        {amount}
      </div>
      <div className="flex-1 font-semibold text-sm">{text}</div>
      <div className=" font-semibold max-w-[40%]">{date}</div>
    </div>
  );
};

export default DashboardFeedItem;
