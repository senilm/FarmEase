import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { Booking, Expense } from "../lib/interfaces";
import Navbar from "../components/Navbar";
import BookingSection from "../components/BookingSection";
import ExpenseSection from "../components/ExpenseSection";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const isAdmin = sessionStorage.getItem('type') == "ADMIN"

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/booking/all`, {
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
      setBookings(res?.bookings.slice(0, 6));
      const bookings = res?.bookings.map((booking: Booking) => ({
        title: `${booking?.User?.name}`,
        start: new Date(booking?.fromDate),
        end: new Date(booking?.toDate),
      }));
      setEvents(bookings);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/expense`, {
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
      setExpenses(res?.expenses.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchExpenses();
  }, []);

  return (
    <section className=" w-full min-h-screen ">
      <Navbar />
      {/* calender */}
      <div className=" max-sm:mt-3 px-5">
        <div className="max-sm:min-h-[50vh] min-h-[85vh]">
          <div className="px-5 py-5 max-sm:px-0">
            <div className=" py-2" style={{ height: '500px', overflowY: 'auto' }}>
              {loading ? (
                <div className=" text-center">Loading</div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%', minWidth: '100%' }}
                  views={["month"]}
                  
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings */}
      {isAdmin ? 
      <div className="pt-5 max-sm:mt-0 mt-5 bg-slate-50 pb-5">
        <div className=" text-center font-bold text-3xl mb-5">Bookings</div>
        <BookingSection bookings={bookings} refetch={fetchBookings} />
        <div className=" px-10">
          {bookings.length == 6 ? (
            <Link to={"/booking"} className="flex justify-end col-span-3">
              <p className="  underline underline-offset-2">See more</p>
            </Link>
          ) : null}
        </div>
      </div>
      :null}

      {/* Expense */}
      {isAdmin ? 
      <div className="pt-5 bg-red-50 pb-10">
        <div className=" text-center font-bold text-3xl mb-5">Expenses</div>
        <ExpenseSection expenses={expenses} refetch={fetchExpenses} />
        <div className="px-10">
          {expenses.length == 6 ? (
            <Link to={"/expense"} className="flex justify-end col-span-3 mt-[-1rem]">
              <p className="  underline underline-offset-2">See more</p>
            </Link>
          ) : null}
        </div>
      </div>
        :null}
    </section>
  );
};

export default Home;
