import { DownloadIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import DashboardCard from "../components/DashboardCard";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import DashboardFeedItem from "../components/DashboardFeedItem";
import {
  filterDateInitialState,
  Booking as BookingI,
  Expense as ExpenseI,
  Transaction,
} from "../lib/interfaces";
import { useEffect, useState } from "react";
import { formatDate, reverseDate } from "../lib/dateFormat";
import GeneratePdf from "../components/generatePdf";
import { pdf } from "@react-pdf/renderer";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState(filterDateInitialState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    setLoadingMore(true);
    try {
      const [bookingsResponse, expensesResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_BASE_URL}/booking?fromDate=${
            dateFilter.fromFilterDate
          }&toDate=${dateFilter.toFilterDate}&dashboard=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        ),
        fetch(
          `${import.meta.env.VITE_BASE_URL}/expense?fromDate=${
            dateFilter.fromFilterDate
          }&toDate=${dateFilter.toFilterDate}&dashboard=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        ),
      ]);

      const [bookingsData, expensesData] = await Promise.all([
        bookingsResponse.json(),
        expensesResponse.json(),
      ]);

      if (!bookingsResponse.ok) {
        console.log(bookingsData?.message);
      }
      if (!expensesResponse.ok) {
        console.log(expensesData?.message);
      }

      const bookings: Transaction[] =
        bookingsData?.bookings.map((booking: BookingI) => ({
          id: booking.id,
          date: new Date(booking.fromDate),
          amount: booking.amount,
          type: "Income",
          fromDate: new Date(booking.fromDate),
          toDate: new Date(booking.toDate),
          userId: booking.userId,
          User: booking.User,
        })) || [];

      const expenses: Transaction[] =
        expensesData?.expenses.map((expense: ExpenseI) => ({
          id: expense.id,
          date: new Date(expense.date),
          fromDate: new Date(expense.date),
          toDate: new Date(expense.date),
          amount: expense.amount,
          type: "Expense",
          note: expense.note,
        })) || [];

      const totalIncome = bookings.reduce(
        (sum: number, booking: Transaction) => sum + booking.amount,
        0
      );
      const totalExpense = expenses.reduce(
        (sum: number, expense: Transaction) => sum + expense.amount,
        0
      );
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setBalance(totalIncome - totalExpense);

      // Combine and sort transactions
      const combinedTransactions: Transaction[] = [
        ...bookings,
        ...expenses,
      ].sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setTransactions(combinedTransactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (dateFilter.fromFilterDate && dateFilter.toFilterDate) {
      fetchData();
    }
  }, [dateFilter]);

  const handleGeneratePDF = async () => {
    const title = `${reverseDate(dateFilter.fromFilterDate)} To ${reverseDate(
      dateFilter.toFilterDate
    )}`;
    const blob = await pdf(
      GeneratePdf(transactions, totalIncome, totalExpense, balance, title)
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <Navbar />
      <div className="md:px-10 px-5 mt-5">
        <div className="px-4  py-4 sm:px-6 lg:px-8 border rounded-lg md:min-h-[80vh] md:max-h-[80vh] flex justify-between gap-2 mb-5 flex-wrap-reverse">
          {/* Left side */}
          <div className=" flex max-sm:w-full  flex-col justify-between gap-3 md:w-[38%] py-4 ">
            <div>
              <DashboardCard title="Income" value={totalIncome} />
            </div>
            <div>
              <DashboardCard title="Expense" value={totalExpense} />
            </div>
            <hr className=" my-4" />
            <div>
              <DashboardCard title="Balance" value={balance} />
            </div>
          </div>

          {/* right side */}
          <div className=" md:w-[60%] flex flex-col py-4 ">
            <div className=" flex justify-between gap-5 flex-wrap">
              <div className=" flex  gap-4 flex-wrap justify-between">
                <div className=" flex items-center gap-2 flex-1">
                  <Label htmlFor="from">From:</Label>
                  <Input
                    id="from"
                    type="date"
                    className="p-1 rounded-lg border"
                    name="fromFilterDate"
                    value={dateFilter.fromFilterDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className=" flex items-center gap-3 max-sm:gap-[1.7rem] flex-1">
                  <Label htmlFor="to">To:</Label>
                  <Input
                    id="to"
                    type="date"
                    className="p-1  rounded-lg border"
                    name="toFilterDate"
                    value={dateFilter.toFilterDate}
                    onChange={handleDateChange}
                  />
                </div>
                  </div>
                <div className=" flex  justify-center max-sm:w-full">
                  <Button
                    className=" flex  gap-2 bg-[#6b4226] hover:bg-[#4d2e1b]"
                    onClick={handleGeneratePDF}
                    disabled={transactions.length == 0}
                  >
                    <span>
                      <DownloadIcon width={18} />
                    </span>
                    Download
                  </Button>
                </div>
            </div>

            <div className=" flex flex-col mt-6 border rounded-lg px-2 md:px-6 py-3 flex-grow max-h-[40vh]  md:max-h-[60vh] overflow-auto">
              <div className=" text-center mb-3 text-xl text-[#6b4226] font-semibold">
                Transactions
              </div>
              <div className=" flex flex-col gap-3 pb-3 pt-2">
                {loadingMore ? (
                  <div className=" text-center">Loading...</div>
                ) : transactions.length == 0 ? (
                  <div className=" text-center">
                    {!dateFilter.fromFilterDate || !dateFilter.toFilterDate ? (
                      <div>Please select date range</div>
                    ) : (
                      <div>No data</div>
                    )}
                  </div>
                ) : (
                  transactions.map((transaction, index) =>
                    transaction.type === "Income" ? (
                      <DashboardFeedItem
                        key={index}
                        amount={transaction.amount}
                        date={`${formatDate(
                          transaction?.fromDate.toString()
                        )} - ${formatDate(transaction.toDate?.toString())}`}
                        type={transaction.type}
                        text={transaction.User?.name || ""}
                      />
                    ) : (
                      <DashboardFeedItem
                        key={index}
                        amount={transaction.amount}
                        date={`${formatDate(transaction.date.toString())}`}
                        type={transaction.type}
                        text={transaction?.note || ""}
                      />
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
