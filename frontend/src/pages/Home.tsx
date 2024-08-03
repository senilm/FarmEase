import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { Booking, Expense } from "../lib/interfaces";
import Navbar from "../components/Navbar";
import BookingSection from "../components/BookingSection";
import ExpenseSection from "../components/ExpenseSection";
import { Link } from "react-router-dom";
import useUserStore, { Farm } from "../store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "../components/ui/select";
import Loader from "../components/Loader";

const localizer = momentLocalizer(moment);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loadingB, setLoadingB] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const { farms } = useUserStore();
  const [currentStat, setCurrentStat] = useState("ADMIN");

  const fetchBookings = async () => {
    setLoadingB(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/booking/all/${selectedFarm?.id}`,
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
      setBookings(res?.bookings.slice(0, 6));
      const bookings = res?.bookings.map((booking: Booking) => ({
        title: `${booking?.User?.name}`,
        start: new Date(booking?.fromDate),
        end: new Date(booking?.toDate),
      }));
      setEvents(bookings);
    } catch (error) {
      console.log(error);
    }finally{
      setLoadingB(false);
    }
  };

  const fetchExpenses = async () => {
    setLoadingE(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/expense/farm/${selectedFarm?.id}`,
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
      setExpenses(res?.expenses.slice(0, 6));
    } catch (error) {
      console.log(error);
    } finally{
      setLoadingE(false);
    }
  };

  useEffect(() => {
    if (selectedFarm) {
      setCurrentStat(selectedFarm.role);
      fetchBookings();
      fetchExpenses();
    }
  }, [selectedFarm]);

  return (
    <section className=" w-full min-h-screen ">
      <Navbar />

      {/* Farm select */}
      <div className=" flex max-sm:px-5 px-10 mt-5 max-sm:mt-3 justify-end">
        <div>
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
              {farms.length > 0 ? (
                farms.map((farm, i) => {
                  return (
                    <SelectItem value={farm.id} key={i}>
                      {farm.name}
                    </SelectItem>
                  );
                })
              ) : (
                <SelectGroup>
                  <SelectLabel>No Farms</SelectLabel>
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* calender */}
      <div className=" px-5 relative">
        <div className="max-sm:min-h-[50vh] min-h-[85vh]">
          <div className="px-5 pb-5 max-sm:px-0 max-sm:pt-5">
            <div
              className=" py-2"
              style={{ height: "500px", overflowY: "auto" }}
            >
              {!selectedFarm ? (
                <div className="text-center text-2xl text-red-950 opacity-70">
                  Please select a farm to continue...
                </div>
              ) : loadingB ? (
                <div className="flex justify-center text-red-950 opacity-70"><Loader className=" w-14 h-14"/></div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%", minWidth: "100%" }}
                  views={["month"]}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings */}
      {currentStat == "ADMIN" ? (
        <div className="pt-5 max-sm:mt-0 mt-5 bg-slate-50 pb-5">
          <div className=" text-center font-bold text-3xl mb-5">Bookings</div>
          <BookingSection bookings={bookings} refetch={fetchBookings} loading={loadingB} />
          <div className=" px-10">
            {bookings.length == 6 ? (
              <Link to={"/booking"} className="flex justify-end col-span-3">
                <p className="  underline underline-offset-2">See more</p>
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Expense */}
      {currentStat == "ADMIN" ? (
        <div className="pt-5 bg-red-50 pb-8">
          <div className=" text-center font-bold text-3xl mb-5">Expenses</div>
          <ExpenseSection expenses={expenses} refetch={fetchExpenses}  loading={loadingE}/>
          <div className="px-10">
            {expenses.length == 6 ? (
              <Link
                to={"/expense"}
                className="flex justify-end col-span-3 mt-[-1rem]"
              >
                <p className="  underline underline-offset-2">See more</p>
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      
    </section>
  );
};

export default Home;
