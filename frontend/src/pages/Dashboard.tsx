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
  userType,
} from "../lib/interfaces";
import { useEffect, useState } from "react";
import { formatDate, reverseDate } from "../lib/dateFormat";
import GeneratePdf from "../components/generatePdf";
import { pdf } from "@react-pdf/renderer";
import useUserStore, { Farm } from "../store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import AddFarmDialog from "../components/AddFarmDialog";
import AddUserDialog from "../components/AddUserDialog";
import { Toaster } from "../components/ui/toaster";
import UserCard from "../components/UserCard";
import Overlay from "../components/Overlay";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState(filterDateInitialState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<userType[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const { farms, userName } = useUserStore();
  const [currentStat, setCurrentStat] = useState("ADMIN");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    setLoadingMore(true);
    try {
      const [bookingsResponse, expensesResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_BASE_URL}/booking/farm/${
            selectedFarm?.id
          }?fromDate=${dateFilter.fromFilterDate}&toDate=${
            dateFilter.toFilterDate
          }&dashboard=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        ),
        fetch(
          `${import.meta.env.VITE_BASE_URL}/expense/farm/${
            selectedFarm?.id
          }?fromDate=${dateFilter.fromFilterDate}&toDate=${
            dateFilter.toFilterDate
          }&dashboard=true`,
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

  const fetchUsers = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/farm/${selectedFarm?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        console.log("Failed to fetch users");
      }

      const response = await res.json();
      setUsers(response?.users);
      setLoadingUser(false);
    } catch (error) {
      console.log("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (selectedFarm) {
      setCurrentStat(selectedFarm.role);
      if (selectedFarm.role == "ADMIN") {
        fetchUsers();
        if (dateFilter.fromFilterDate && dateFilter.toFilterDate) {
          fetchData();
        }
      }
    }
  }, [selectedFarm]);

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
      <div className="md:px-5 px-5 mt-2">
        <div className=" flex justify-end gap-5 items-center">
          <p className=" max-sm:text-xs flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-0">
            Hey,{" "}
            <span className=" font-serif md:text-xl max-md:text-lg max-w-[7ch] overflow-hidden whitespace-nowrap text-ellipsis inline-block">
              {userName} 
            </span>
          </p>
          <AddFarmDialog />
          <Select
            value={selectedFarm?.id || ""}
            onValueChange={(value) => {
              const farm = farms.find((f) => f.id === value);
              if (farm) {
                setSelectedFarm(farm);
              }
            }}
          >
            <SelectTrigger className="md:w-56 max-md:w-44">
              <SelectValue placeholder="Select a farm" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => {
                return (
                  <SelectItem value={farm.id} key={farm.id}>
                    {farm.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className=" relative">
        <div
          className={`md:px-5 px-5 mt-4 ${
            !selectedFarm || currentStat == "USER"
              ? "pointer-events-none opacity-30"
              : ""
          }`}
        >
          <div className="px-4 pt-2 sm:px-6 lg:px-1 border-t pb-3 flex justify-between gap-2 mb-5 flex-wrap">
            {/* Left side */}
            <div className=" flex max-sm:w-full  flex-col  gap-3 md:w-[38%] py-2 md:pr-6 md:pl-5 md:border-r">
              <div className=" flex justify-end">
                <AddUserDialog
                  farmId={selectedFarm?.id || ""}
                  fetchUsers={fetchUsers}
                />
              </div>

              <div className=" flex w-full flex-col border rounded-lg max-h-[20.3rem] min-h-[20.3rem] overflow-auto">
                <div className=" text-center mb-3 mt-1 text-xl text-[#6b4226] font-semibold py-2 ">
                  List of users
                </div>
                <div className=" flex flex-col gap-3 pb-3 pt-2 md:px-10 px-5">
                  {loadingUser ? (
                    <div className=" flex justify-center text-red-950 opacity-70"><Loader className=" w-7 h-7"/></div>
                  ) : users?.length == 0 ? (
                    <div className=" text-center">
                      {!selectedFarm ? (
                        <div>Please select farm</div>
                      ) : (
                        <div>No user for this farm</div>
                      )}
                    </div>
                  ) : (
                    users?.map((user) => (
                      <UserCard
                        name={user.name}
                        key={user.id}
                        role={user.role}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* right side */}
            <div className=" md:w-[60%] flex flex-col pt-2 pb-1">
              {/* Filters */}
              <div className=" flex justify-between gap-5 flex-wrap">
                <div className=" flex  gap-4 flex-wrap justify-between">
                  <div className=" flex items-center gap-2 flex-1 ">
                    <Label htmlFor="from">From:</Label>
                    <Input
                      id="from"
                      type="date"
                      className="p-1 rounded-lg border max-sm:w-1/2"
                      name="fromFilterDate"
                      value={dateFilter.fromFilterDate}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className=" flex items-center gap-3 max-sm:gap-[1.6rem] flex-1">
                    <Label htmlFor="to">To:</Label>
                    <Input
                      id="to"
                      type="date"
                      className="p-1  rounded-lg border max-sm:w-1/2"
                      name="toFilterDate"
                      value={dateFilter.toFilterDate}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>

                <div className=" flex justify-end  md:justify-center max-sm:w-full">
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

              {/* Transaction & blocks*/}
              <div className=" flex justify-between flex-wrap-reverse">
                <div className=" flex w-full md:mr-4 flex-col mt-3 border rounded-lg max-h-[20.3rem] min-h-[20.3rem] px-2 md:px-6 py-3 md:max-w-[70%]  overflow-auto">
                  <div className=" text-center mb-3 text-xl text-[#6b4226] font-semibold">
                    Transactions
                  </div>
                  <div className=" flex flex-col gap-3 pb-3 pt-2">
                    {loadingMore ? (
                      <div className="flex justify-center text-red-950 opacity-70"><Loader className=" h-7 w-7"/></div>
                    ) : transactions.length == 0 ? (
                      <div className=" text-center">
                        {!dateFilter.fromFilterDate ||
                        !dateFilter.toFilterDate ? (
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

                {/* Blocks */}
                <div className="mt-3 flex md:flex-col md:gap-4 max-sm:gap-2 flex-1 max-sm:justify-between">
                  <div className=" w-full">
                    <DashboardCard title="Income" value={totalIncome} />
                  </div>
                  <div className=" w-full">
                    <DashboardCard title="Expense" value={totalExpense} />
                  </div>
                  <hr className=" max-sm:hidden my-2" />
                  <div className=" w-full">
                    <DashboardCard title="Balance" value={balance} />
                  </div>
                </div>
                <Toaster />
              </div>
            </div>
          </div>
        </div>

        {!selectedFarm && <Overlay text="Please select a farm to continue" />}

        {currentStat === "USER" && (
          <Overlay text="You do not have access, Please contact admin" />
        )}
      </div>
    </section>
  );
};

export default Dashboard;
