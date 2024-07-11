import { Booking } from "../lib/interfaces";
import BookingCard from "./BookingCard";

interface BookingSectionProps {
    bookings: Booking[],
    refetch:()=>void
}
const BookingSection: React.FC<BookingSectionProps> = ({ bookings, refetch }) => {
  return (
    <>
      <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4 px-10">
        {bookings.length == 0 ? <div className=" text-center col-span-3">No bookings</div> :bookings.map((booking) => (
          <BookingCard key={booking.id} data={booking} refetch={refetch} />
        ))}
      </div>
    </>
  );
};

export default BookingSection;
