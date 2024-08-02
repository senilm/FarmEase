import { formatDate } from "../lib/dateFormat";
import { Booking } from "../lib/interfaces";
import DeleteBookingModal from "./DeleteBookingModal";

interface BookingCardProps {
  data: Booking;
  refetch:()=>void
}

const BookingCard: React.FC<BookingCardProps> = ({ data, refetch }) => {
  return (
    <div className="border px-4 py-3 rounded-lg mb-2 bg-white shadow-lg">
      <div className=" flex justify-between">
        <div>

        <div className=" font-bold text-xl text-green-500">₹{data.amount}</div>
        <div className=" font-semibold text-gray-500">{data.Farm.name}</div>
        </div>
        <h3 className="font-bold">{data.User.name}</h3>
      </div>
      <div className=" flex justify-between items-center mt-2">
        <p>
          {formatDate(data.fromDate.toString())} -{" "}
          {formatDate(data.toDate.toString())}
        </p>
        <DeleteBookingModal id={data.id} refetch={refetch}/>
      </div>
    </div>
  );
};

export default BookingCard;
