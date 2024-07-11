import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Expense as ExpenseI, expenseError, filterDateInitialState } from "../lib/interfaces";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import Navbar from "../components/Navbar";
import ExpenseSection from "../components/ExpenseSection";

const schema = z.object({
  amount: z.string().min(1, { message: "Amount should be greater than 0" }),
  note: z.string().min(1, { message: "Please provide some description" }),
  expDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Select date",
  }),
});

const Expense = () => {
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<expenseError>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<ExpenseI[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDateInitialState);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
    setPage(1);
  };

  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true)
      const parseResponse = schema.safeParse({
        amount,
        note,
        expDate
      });

      if (parseResponse.error) {
        setErrors(parseResponse.error.formErrors.fieldErrors);
        return;
      }
      setErrors({});
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          note,
          date:new Date(expDate)
        }),
      });
      const res = await response.json();
      if (!response.ok) {
        setApiError(res?.message);
        toast({
          title: "ERROR 👎👎",
          description: res?.message,
          variant: "destructive",
        });
        return;
      }
      setApiError("");
      toast({
        title: "SUCCESS 💯",
        description: res?.message,
      });
      setPage(1);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setAmount("");
      setNote("");
      setExpDate(new Date().toISOString().split('T')[0])
    }
  };

  const fetchExpenses = async (page = 1) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/expense?page=${page}&fromDate=${dateFilter.fromFilterDate}&toDate=${dateFilter.toFilterDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        console.log(res?.message);
      }

      if(page == 1){
        setExpenses(res?.expenses);
      }else{
        setExpenses((prevExpenses) => [...prevExpenses, ...res?.expenses])
      }
      setHasMore(res?.expenses.length === 6);

    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreExpenses = async () => {
    setLoadingMore(true);
    await fetchExpenses(page + 1);
    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  useEffect(()=>{
    fetchExpenses()
  },[dateFilter])

  return (
    <div>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#f5f5f5] px-6 py-8 sm:px-10 sm:py-12">
            <h1 className="text-3xl font-bold text-[#333] mb-4">Expense</h1>
            <div className="  text-red-500 ">{apiError}</div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {/* Amount */}
              <div className="grid gap-2">
                <label
                  htmlFor="booking-amount"
                  className="text-sm font-medium text-[#333]"
                >
                  Expense
                </label>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  name="amount"
                  onChange={handleAmountChange}
                  className="bg-white border-[#ccc] rounded-md px-4 py-2 text-[#333] focus:border-[#666] focus:ring-0"
                />
                {errors.amount && (
                  <span className="text-red-500 text-sm">
                    {errors.amount[0]}
                  </span>
                )}
              </div>

              {/* Note */}
              <div className="grid gap-2 ">
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-[#333]"
                >
                  Note
                </label>
                <Input
                  type="text"
                  placeholder="Note"
                  value={note}
                  name="note"
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-white border-[#ccc] rounded-md px-4 py-2 text-[#333] focus:border-[#666] focus:ring-0"
                />
                {errors.note && (
                  <span className="text-red-500 text-sm">{errors.note[0]}</span>
                )}
              </div>

              <div className="grid gap-2 ">
              <label
                  htmlFor="check-in"
                  className="text-sm font-medium text-[#333]"
                >
                  Date
                </label>
                <Input
                  type="date"
                  placeholder="From date"
                  id="check-in"
                  className="w-full flex"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
                {Object.keys(errors).length !== 0 && errors?.expDate && (
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.expDate[0]}
                  </span>
                )}
              </div>
            </form>
          </div>
          <Toaster />

          <div className="bg-[#f5f5f5] px-6 py-4 sm:px-10 sm:py-6 flex justify-end">
            <Button
              className="bg-[#6b4226] text-white rounded-md px-6 py-2 hover:bg-[#4d2e1b]"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "..." : "Add"}
            </Button>
          </div>
        </div>
      </div>
     
      <div className="pt-5 mt-5 pb-5 bg-red-50">
      <div className=" text-center font-bold text-3xl mb-5">Expenses</div>
      <div className="px-10 flex items-center gap-5">
          <div className=" flex items-center gap-2 text-lg">
                <p className=" text-[#6b4226]">From: </p>
                <input
                  type="date"
                  className="p-1 rounded-lg border"
                  name="fromFilterDate"
                  value={dateFilter.fromFilterDate}
                  onChange={handleDateChange}
                />
          </div>
          <div className=" flex items-center gap-2 text-lg">
            <p className=" text-[#6b4226]">To: </p>
            <input
              type="date"
              className="p-1  rounded-lg border"
              name="toFilterDate"
              value={dateFilter.toFilterDate}
              onChange={handleDateChange}
            />
          </div>
      </div>
        <ExpenseSection expenses={expenses} refetch={fetchExpenses} />
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              className="bg-[#6b4226] text-white rounded-md px-6 py-2 hover:bg-[#4d2e1b]"
              onClick={loadMoreExpenses}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Expense;
