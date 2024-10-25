import xlsx from "json-as-xlsx";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";
import { format } from 'date-fns';

// function extractBookingDetailsColumn(booking: TbookingsValidator) {
//   const keys = Object.keys(booking)
//   const columns = keys.map((k) => { return { label: k, value: k } })
//   return columns
// }
const extractBookingDetailsColumn = () => [
  { label: 'BookingId', value: 'id' },
  { label: 'Name', value: 'userName' }, 
  { label: 'Email', value: 'userEmail' }, 
  { label: 'Hostel Name', value: 'hostelName' },
  { label: 'Booking Date', value: 'bookingDate' },
  { label: 'Checkin Date', value: 'bookedFromDt' },
  { label: 'Checkout Date', value: 'bookedToDt' },
  { label: 'Room Type', value: 'roomType' },
  { label: 'Total Room', value: 'totalRoom' },
  { label: 'Total Guests', value: 'totalGuests' }, 
  { label: 'Total Amount', value: 'amount' },
  { label: 'Booking Status', value: 'bookingStatus' },
  { label: 'Booked By', value: 'updateBy' },
];

const formatHostelName = (hostelName: string) => {
  return hostelName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const downloadToExcel = ({
  bookings,
}: {
  bookings: TbookingsValidator[];
}) => {
  if (bookings.length > 0) {
    const data = [
      {
        sheet: "Booking Details",
        columns: extractBookingDetailsColumn(),
        content: bookings.map((booking: any) => ({
          id: booking.id,
          userName: booking.userName,
          userEmail: booking.userEmail,
          hostelName: formatHostelName(booking.hostelName),
          roomType: formatHostelName(booking.roomType),
          bookingDate: format(new Date(booking.bookingDate), "dd-MM-yyyy"),
          bookedFromDt: format(new Date(booking.bookedFromDt), "dd-MM-yyyy"),
          bookedToDt: format(new Date(booking.bookedToDt), "dd-MM-yyyy"),
          totalRoom: booking.bookedBed,
          totalGuests: booking.guestsList?.length || 1,
          amount: booking.amount,
          bookingStatus: booking.bookingStatus,
          updateBy: booking.updateBy
        })),
      },
    ];

    const settings = {
      fileName: "Booking_Details",
    };

    //@ts-ignore
    xlsx(data, settings);
  }
};