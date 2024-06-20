import xlsx, { IJsonSheet } from "json-as-xlsx";
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
  { label: 'Checkin Date', value: 'bookedFromDt' },
  { label: 'Checkout Date', value: 'bookedToDt' },
  { label: 'Total Amount', value: 'amount' },
  { label: 'Total Room', value: 'totalRoom' },
  { label: 'Total Guests', value: 'bookedRoom' }, 
  { label: 'Booking Status', value: 'bookingStatus' }
];

export const downloadToExcel = ({ bookings }: { bookings: TbookingsValidator[] }) => {
  if (bookings.length > 0) {
    const data = [{
      sheet: "Booking Details",
      columns: extractBookingDetailsColumn(),
      content: bookings.map((booking: any) => ({
        id: booking.id,
        userName: booking.user.name,
        userEmail: booking.user.email,
        hostelName: booking.hostelName,
        bookedFromDt: format(new Date(booking.bookedFromDt), 'yyyy-MM-dd'),
        bookedToDt: format(new Date(booking.bookedToDt), 'yyyy-MM-dd'),
        amount: booking.amount,
        totalRoom: booking.totalRoom,
        guests: booking.bookedRoom,
        bookingStatus: booking.bookingStatus,
      })),
    }];

    const settings = {
      fileName: "Booking_Details",
    };

    //@ts-ignore
    xlsx(data, settings);
  }
};