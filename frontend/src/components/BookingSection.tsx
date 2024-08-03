import { Booking } from "../lib/interfaces";
import BookingCard from "./BookingCard";
import SkeletonLoader from "./SkeletonLoader";

interface BookingSectionProps {
  bookings: Booking[];
  refetch: () => void;
  loading: boolean;
}
const BookingSection: React.FC<BookingSectionProps> = ({
  bookings,
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
        ) : bookings.length == 0 ? (
          <div className=" text-center col-span-3">No bookings</div>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} data={booking} refetch={refetch} />
          ))
        )}
      </div>
    </>
  );
};

export default BookingSection;
