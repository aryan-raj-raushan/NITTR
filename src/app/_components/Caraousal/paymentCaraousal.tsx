"use client"
import * as React from "react"
import paymentLogo from "public/animat-checkmark.gif"

import { Card, CardContent } from "~/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel"
import { Label } from "~/components/ui/label"
import CardDetails from "../payment/CardDetails"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { api } from "~/trpc/react"

export function PaymentCarousel({ bookingId }: { bookingId: string }) {
  const [capi, setApi] = React.useState<CarouselApi>()
  const sendMailMutation = api.mail.sendMail.useMutation()

  React.useEffect(() => {
    if (!capi) {
      return
    }

    capi.on("select", () => {
      // Do something on select.
    })
  }, [capi])

  return (
    <div>
      <Carousel setApi={setApi} className="size-[20rem] md:size-[40rem]">
        <CarouselContent>
          <CarouselItem>
            <Card>
              <CardContent className="flex gap-2 flex-col aspect-square items-center justify-center p-6">
                <CardDetails></CardDetails>
                <Button>
                  <Label htmlFor="next">Next</Label>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>


          <CarouselItem>
            <Card>
              <CardContent className="flex gap-2 flex-col aspect-square items-center justify-center p-6">
                <div>
                  <div>OTP</div>
                  <Input placeholder="xxxx"></Input>
                </div>
                <Button>
                  <Label htmlFor="next">Next</Label>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>


          <CarouselItem>
            <Card>
              <CardContent className="flex flex-col   gap-2  aspect-square items-center justify-center p-6">
                <Image src={paymentLogo} alt="loading..." />
                <div className="text-2xl">Payment Successful</div>
                <Button>
                  <Link onClick={() => {
                    sendMailMutation.mutate({
                      subject: "Payment Details",
                      text: JSON.stringify({
                        "paymentId": "123456789",
                        "amount": 150.00,
                        "currency": "USD",
                        "paymentMethod": "credit_card",
                        "cardDetails": {
                          "cardNumber": "XXXX-XXXX-XXXX-1234",
                          "cardHolderName": "John Doe",
                          "expiryDate": "12/23",
                          "cvv": "123"
                        },
                        "payerDetails": {
                          "firstName": "John",
                          "lastName": "Doe",
                          "email": "john.doe@example.com",
                          "phone": "+1234567890"
                        },
                        "payeeDetails": {
                          "businessName": "ABC Corporation",
                          "email": "contact@abccorp.com",
                          "phone": "+0987654321"
                        },
                        "transactionDate": "2024-03-12",
                        "status": "completed",
                        "shippingAddress": {
                          "street": "123 Main St",
                          "city": "Anytown",
                          "state": "Anystate",
                          "country": "Country",
                          "postalCode": "12345"
                        },
                        "billingAddress": {
                          "street": "123 Main St",
                          "city": "Anytown",
                          "state": "Anystate",
                          "country": "Country",
                          "postalCode": "12345"
                        }
                      }
                      ),
                      to: ""
                    })
                  }} href={`/payment/success/${bookingId}`}>Done</Link>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>



        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext id="next" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
      </div>
    </div>
  )
}
