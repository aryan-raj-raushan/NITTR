import { PaymentCarousel } from "../_components/Caraousal/paymentCaraousal";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const bookingId = searchParams?.id as string
  return <div className="grid items-center justify-center"><PaymentCarousel bookingId={bookingId}></PaymentCarousel></div>
}
