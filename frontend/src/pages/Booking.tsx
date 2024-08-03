import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { z } from "zod";
import {
  Booking as BookingI,
  FormErrors,
  filterDateInitialState,
} from "../lib/interfaces";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import Navbar from "../components/Navbar";
import BookingSection from "../components/BookingSection";
import useUserStore, { Farm } from "../store/store";
import Loader from "../components/Loader";

const schema = z.object({
  amount: z.string().min(1, { message: "Amount should be greater than 0" }),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Select from date",
  }),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Select to date",
  }),
  farm: z.string().min(1, { message: "Please select a farm" }),
});

const Booking = () => {
  const [amount, setAmount] = useState<string>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingI[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [type, setType] = useState("self");
  const [dateFilter, setDateFilter] = useState(filterDateInitialState);
  const [selectedFarm, setSelectedFarm] = useState("");
  const { farms } = useUserStore();

  const [filFarm, setFilFarm] = useState<Farm | null>(null);
  const [currentStat, setCurrentStat] = useState("ADMIN");
 
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
      setLoading(true);
      const parseResponse = schema.safeParse({
        amount,
        fromDate,
        toDate,
        farm: selectedFarm,
      });
      if (parseResponse.error) {
        setErrors(parseResponse.error.formErrors.fieldErrors);
        return;
      }
      setErrors({});
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          farmId: selectedFarm,
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
      if(filFarm)fetchBookings();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSelectedFarm("");
      setToDate("");
      setAmount("");
      setFromDate("");
    }
  };

  const fetchBookings = async (page = 1) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/booking/farm/${filFarm?.id}?page=${page}&type=${type}&fromDate=${
          dateFilter.fromFilterDate
        }&toDate=${dateFilter.toFilterDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const res = await response.json();

      if (!response.ok) {
        console.log(res?.message);
      }

      if (page === 1) {
        setBookings(res?.bookings);
      } else {
        setBookings((prevBookings) => [...prevBookings, ...res.bookings]);
      }

      setHasMore(res?.bookings.length === 6);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreBookings = async () => {
    setLoadingMore(true);
    await fetchBookings(page + 1);
    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (filFarm) {
      setCurrentStat(filFarm.role)
      setPage(1)
      fetchBookings();
    }
  }, [type, dateFilter, filFarm]);

  return (
    <div>
      <Navbar />
      <div className="md:max-w-3xl mx-auto w-full md:px-4 max-sm:px-7 pt-4 sm:px-6 lg:px-8 ">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#f5f5f5] px-6 py-8 sm:px-10 sm:py-12">
            <div className=" flex items-start gap-5">
              <h1 className="text-3xl font-bold text-[#333] mb-4">Booking</h1>
              <p className=" text-red-500 mt-2">{apiError}</p>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">

              {/* from */}
              <div className="grid gap-2">
                <label
                  htmlFor="check-in"
                  className="text-sm font-medium text-[#333]"
                >
                  From
                </label>
                <Input
                  type="date"
                  placeholder="From date"
                  id="check-in"
                  className="w-full flex"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                {Object.keys(errors).length !== 0 && errors?.fromDate && (
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.fromDate[0]}
                  </span>
                )}
              </div>

              {/* To */}
              <div className="grid gap-2">
                <label
                  htmlFor="check-out"
                  className="text-sm font-medium text-[#333]"
                >
                  To
                </label>
                <Input
                  type="date"
                  placeholder="To date"
                  id="check-out"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                {errors.toDate && (
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.toDate[0]}
                  </span>
                )}
              </div>

              {/* farm */}
              <div className="grid gap-2">
                <label
                  htmlFor="guest-name"
                  className="text-sm font-medium text-[#333]"
                >
                  Farm
                </label>
                <Select
                  value={selectedFarm}
                  onValueChange={(value) => setSelectedFarm(value)}
                >
                  <SelectTrigger
                    id="guest-name"
                    className="bg-white border-[#ccc] rounded-md px-4 py-2 text-[#333] focus:border-[#666] focus:ring-0"
                  >
                    <SelectValue placeholder="Select a name" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms?.map((option) => {
                      return (
                        <SelectItem value={option.id} key={option.id}>
                          {option.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.farm && (
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.farm[0]}
                  </span>
                )}
              </div>

              {/* Amount */}
              <div className="grid gap-2">
                <label
                  htmlFor="booking-amount"
                  className="text-sm font-medium text-[#333]"
                >
                  Booking Amount
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
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.amount[0]}
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
              {loading ? <Loader className=" w-5 h-5"/> : "Book Now"}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-5 bg-slate-50 pb-5">
        <div className=" text-center font-bold text-3xl mb-10 mt-3">
          Bookings
        </div>
        <div className="px-10 flex items-center gap-5 flex-wrap max-sm:justify-center">
          <div className=" flex gap-3">
            <Button
              onClick={() => {
                setType("self");
                setPage(1);
              }}
              disabled={type == "self"}
              className="cursor-pointer bg-[#6b4226] text-white hover:bg-[#4d2e1b]"
            >
              My Bookings
            </Button>
            {currentStat == "ADMIN" ? (
              <Button
                onClick={() => {
                  setType("all");
                  setPage(1);
                }}
                disabled={type == "all"}
                className="bg-[#6b4226] cursor-pointer text-white hover:bg-[#4d2e1b]"
              >
                All Bookings
              </Button>
            ) : null}
          </div>
          <div className=" flex gap-3 flex-wrap">

            <div className=" flex items-center gap-2 text-lg max-sm:gap-[0.8rem] md:w-44 max-sm:w-[12.7rem]">
             <p className=" text-sm">Farm</p>
              <Select
                value={filFarm?.id || ""}
                onValueChange={(value) => {
                  const farm = farms.find((f) => f.id === value);
                  if (farm) {
                    setFilFarm(farm);
                  }
                }}
              >
                <SelectTrigger
                  id="guest-name"
                  className="bg-white border-[#ccc] rounded-md px-4 py-2 text-[#333] focus:border-[#666] focus:ring-0"
                >
                  <SelectValue placeholder="Select a farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms?.map((option) => {
                    return (
                      <SelectItem value={option.id} key={option.id}>
                        {option.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className=" flex items-center gap-2 text-lg">
              <p className="text-sm">From: </p>
              <input
                type="date"
                className="p-1 rounded-lg border"
                name="fromFilterDate"
                value={dateFilter.fromFilterDate}
                onChange={handleDateChange}
              />
            </div>
            <div className=" flex items-center gap-2 text-lg max-sm:gap-[1.7rem]">
              <p className="text-sm">To: </p>
              <input
                type="date"
                className="p-1  rounded-lg border"
                name="toFilterDate"
                value={dateFilter.toFilterDate}
                onChange={handleDateChange}
              />
            </div>

          </div>
        </div>
        <BookingSection bookings={bookings} refetch={fetchBookings} loading={false}/>
        {hasMore && filFarm && (
          <div className="flex justify-center mt-6">
            <Button
              className="bg-[#6b4226] text-white rounded-md px-6 py-2 hover:bg-[#4d2e1b]"
              onClick={loadMoreBookings}
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

export default Booking;
