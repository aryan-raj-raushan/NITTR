"use client";
// import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  // Copy,
  CreditCard,
  File,
  // Home,
  // LineChart,
  ListFilter,
  // MoreVertical,
  // Package,
  // Package2,
  // PanelLeft,
  // Search,
  // Settings,
  // ShoppingCart,
  // Truck,
  // Users2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import {
  // BookingDetails,
  GuestHouse,
  RoomCharges,
  TypeOrg,
} from "@prisma/client";
import { useMemo, useState } from "react";
import {
  TbookingsValidator,
  emptyBooking,
} from "~/utils/validators/bookingValidators";
import { useRouter } from "next/navigation";
// import { api } from "~/trpc/react";
// import { removeUnderscore } from "~/lib/utils";
import AdminNav from "./AdminNav";
import {
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  isAfter,
} from "date-fns";
import { downloadToExcel } from "~/lib/xlsx";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { removeUnderscore } from "~/lib/utils";

// function findRoomCharge(
//   roomCharges: any,
//   booking: TbookingsValidator,
//   typeOrg: TypeOrg,
// ) {
//   const rates = roomCharges.find((r: any) => {
//     return r.hostelName == booking.hostelName;
//   });
//   if (rates) {
//     return rates[typeOrg];
//   } else return 0;
// }

export default function AdminDashboardV2({
  bookings,
  hostelName,
}: {
  bookings: TbookingsValidator[];
  hostelName: GuestHouse;
}) {
  const router = useRouter();

  const [selectedBooking, setSelectedBooking] = useState<
    TbookingsValidator | any
  >(
    bookings
      .slice()
      .sort(
        (a: TbookingsValidator, b: TbookingsValidator) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
      )[0] ?? emptyBooking,
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>();
  const [customStartDate, setCustomStartDate] = useState();
  const [customEndDate, setCustomEndDate] = useState();
  const [selectedOption, setSelectedOption] = useState("");

  const filterBookings = (
    bookings: TbookingsValidator[],
    range: string,
    customStartDate?: any,
    customEndDate?: any,
  ) => {
    const now = new Date();
    let filteredBookings: any = [];

    switch (range) {
      case "upcoming":
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return isAfter(bookingDate, now);
        });
        break;
      case "today":
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= todayStart && bookingDate <= todayEnd;
        });
        break;
      case "lastWeek":
        const lastWeekStart = subDays(now, 7);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= lastWeekStart && bookingDate <= now;
        });
        break;
      case "lastMonth":
        const lastMonthStart = subMonths(now, 1);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= lastMonthStart && bookingDate <= now;
        });
        break;
      case "lastThreeMonths":
        const lastThreeMonthsStart = subMonths(now, 3);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= lastThreeMonthsStart && bookingDate <= now;
        });
        break;
      case "lastSixMonths":
        const lastSixMonthsStart = subMonths(now, 6);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= lastSixMonthsStart && bookingDate <= now;
        });
        break;
      case "lastYear":
        const lastYearStart = subYears(now, 1);
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookedFromDt);
          return bookingDate >= lastYearStart && bookingDate <= now;
        });
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          filteredBookings = bookings.filter((booking) => {
            const bookingDate = new Date(booking.bookedFromDt);
            return (
              bookingDate >= customStartDate && bookingDate <= customEndDate
            );
          });
        }
        break;
      default:
        filteredBookings = bookings;
    }
    return filteredBookings;
  };

  const handleSelect = (range: any) => {
    setSelectedOption(range);
    if (range !== "custom") {
      setIsDropdownVisible(false);
      const filteredBookings = filterBookings(bookings, range);
      if (filteredBookings.length === 0) {
        let message = "";

        switch (range) {
          case "upcoming":
            message = "There are no bookings on upcoming dates";
            break;
          case "lastWeek":
            message = "There are no bookings in the last week";
            break;
          case "lastMonth":
            message = "There are no bookings in the last month";
            break;
          case "lastThreeMonths":
            message = "There are no bookings in the last three months";
            break;
          case "lastSixMonths":
            message = "There are no bookings in the last six months";
            break;
          case "lastYear":
            message = "There are no bookings in the last year";
            break;
          default:
            message = "There are no bookings for the selected range";
        }

        toast.info(message);
      } else {
        downloadToExcel({ bookings: filteredBookings });
      }
    } else {
      setIsDropdownVisible(false);
    }
  };

  const applyCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      toast.info(
        "Please select both start and end dates for the custom range.",
      );
      return;
    }
    setIsDropdownVisible(false);
    setSelectedOption("");
    const filteredBookings = filterBookings(
      bookings,
      "custom",
      customStartDate,
      customEndDate,
    );

    if (filteredBookings.length === 0) {
      toast.info("There are no bookings in the selected custom date range");
    } else {
      downloadToExcel({ bookings: filteredBookings });
    }
  };

  const options = [
    { label: "Upcoming", value: "upcoming" },
    // { label: "Today", value: "today" },
    { label: "Last Week", value: "lastWeek" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Three Months", value: "lastThreeMonths" },
    { label: "Last Six Months", value: "lastSixMonths" },
    // { label: "Last Year", value: "lastYear" },
    { label: "Custom Date Range", value: "custom" },
  ];

  const guestHouses = [
    { value: "all", name: "All Bookings" },
    {
      value: GuestHouse.SARAN_GUEST_HOUSE,
      name: "Saran Guest House",
    },
    {
      value: GuestHouse.VISVESVARAYA_GUEST_HOUSE,
      name: "Visvesvaraya Guest House",
    },
    {
      value: GuestHouse.EXECUTIVE_GUEST_HOUSE,
      name: "Executive Guest House",
    },
  ];

  const sortedAndFilteredData = useMemo(() => {
    return [...bookings]
      .filter((item: any) =>
        selectedFilter ? item.bookingStatus === selectedFilter : true,
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
      );
  }, [bookings, selectedFilter]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const handleNextBooking = () => {
    const currentIndex = sortedAndFilteredData.findIndex(
      (booking) => booking.id === selectedBooking.id,
    );
    if (currentIndex < sortedAndFilteredData.length - 1) {
      setSelectedBooking(sortedAndFilteredData[currentIndex + 1]);
    }
  };

  const handlePreviousBooking = () => {
    const currentIndex = sortedAndFilteredData.findIndex(
      (booking) => booking.id === selectedBooking.id,
    );
    if (currentIndex > 0) {
      setSelectedBooking(sortedAndFilteredData[currentIndex - 1]);
    }
  };

  return (
    <TooltipProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col bg-muted/40">
        <div className="flex flex-col px-2 sm:gap-4 sm:py-4">
          <main className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-5/6 flex-col gap-4 sm:w-4/6">
              <AdminNav />
              <div className="flex flex-col gap-4 sm:flex-row ">
                <Card className="w-full sm:w-1/3">
                  <CardHeader className="">
                    <CardTitle>Create Booking</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      Manage Bookings with Insightful Analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex w-full flex-col gap-2">
                    <Button>
                      <Link href={"/admin/bookings/create"}>
                        Create New Booking
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="w-full sm:w-1/3">
                  <CardHeader>
                    <CardTitle>Manage Rooms</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      Manage Rooms with insightful analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex w-full flex-col gap-2">
                    <Button>
                      <Link href={"/admin/hotels/manage-hotel"}>
                        Manage Rooms
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="w-full sm:w-1/3">
                  <CardHeader className="pb-2">
                    <CardDescription>
                      Confirmed Bookings :{" "}
                      <span className="pt-2 text-xl font-semibold">
                        {bookings.reduce((a, c) => {
                          return c.bookingStatus == "CONFIRMED" ? a + 1 : a;
                        }, 0)}
                      </span>
                    </CardDescription>
                    <CardDescription>
                      Awaiting Confirmation :{" "}
                      <span className="pt-2 text-xl font-semibold">
                        {bookings.reduce((a, c) => {
                          return c.bookingStatus == "UNCONFIRMED" ? a + 1 : a;
                        }, 0)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="text-base text-muted-foreground">
                      Out of Total{" "}
                      <span className="text-xl font-semibold">
                        {bookings.length}
                      </span>{" "}
                      bookings
                    </div>
                  </CardContent>
                  <CardFooter className="px-4">
                    <Progress
                      value={
                        (bookings.reduce((a, c) => {
                          return c.bookingStatus == "CONFIRMED" ? a + 1 : a;
                        }, 0) /
                          bookings.length) *
                        100
                      }
                    />
                  </CardFooter>
                </Card>
              </div>
              <Tabs defaultValue={hostelName ?? "all"}>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-0">
                  <TabsList>
                    <TabsTrigger
                      onClick={() => {
                        router.push(`/admin`, { scroll: false });
                      }}
                      value="all"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => {
                        router.push(
                          `/admin?hostel=${GuestHouse.SARAN_GUEST_HOUSE}`,
                          { scroll: false },
                        );
                      }}
                      value={GuestHouse.SARAN_GUEST_HOUSE}
                    >
                      Saran
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => {
                        router.push(
                          `/admin?hostel=${GuestHouse.VISVESVARAYA_GUEST_HOUSE}`,
                          { scroll: false },
                        );
                      }}
                      value={GuestHouse.VISVESVARAYA_GUEST_HOUSE}
                    >
                      Visvesvaraya
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => {
                        router.push(
                          `/admin?hostel=${GuestHouse.EXECUTIVE_GUEST_HOUSE}`,
                          { scroll: false },
                        );
                      }}
                      value={GuestHouse.EXECUTIVE_GUEST_HOUSE}
                    >
                      Executive
                    </TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-sm"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">
                            {selectedFilter || "Filter"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={selectedFilter}>
                          <DropdownMenuCheckboxItem
                            checked={selectedFilter === "Checkout"}
                            onCheckedChange={() =>
                              handleFilterChange("CHECKOUT")
                            }
                          >
                            Checkout
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedFilter === "Confirmed"}
                            onCheckedChange={() =>
                              handleFilterChange("CONFIRMED")
                            }
                          >
                            Confirmed
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedFilter === "Cancelled"}
                            onCheckedChange={() =>
                              handleFilterChange("CANCELED")
                            }
                          >
                            Cancelled
                          </DropdownMenuCheckboxItem>
                          {selectedFilter && (
                            <DropdownMenuCheckboxItem
                              checked={false}
                              onCheckedChange={() => setSelectedFilter(null)}
                              className="cursor-pointer border-t pl-2 text-red-500 hover:text-red-700"
                            >
                              CLEAR
                            </DropdownMenuCheckboxItem>
                          )}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* EXPORT BUTTON */}
                    <div className="relative inline-block">
                      <button
                        onClick={() => {
                          setIsDropdownVisible(!isDropdownVisible);
                          setSelectedOption("");
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                      >
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Export</span>
                      </button>
                      {isDropdownVisible && (
                        <div className="absolute z-10 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
                          {options.map((option) => (
                            <button
                              key={option.value}
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => handleSelect(option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {selectedOption === "custom" && (
                        <div className="absolute z-10 mt-2 w-96 rounded-md border border-gray-300 bg-white p-4 shadow-lg">
                          <div className="flex items-center gap-2">
                            <DatePicker
                              selected={customStartDate}
                              onChange={(date: any) => setCustomStartDate(date)}
                              selectsStart
                              startDate={customStartDate}
                              endDate={customEndDate}
                              maxDate={customEndDate}
                              placeholderText="Select start date"
                              className="mb-2 w-full rounded-md border p-2"
                            />
                            <DatePicker
                              selected={customEndDate}
                              onChange={(date: any) => setCustomEndDate(date)}
                              selectsEnd
                              startDate={customStartDate}
                              endDate={customEndDate}
                              minDate={customStartDate}
                              placeholderText="Select end date"
                              className="mb-2 w-full rounded-md border p-2"
                            />
                          </div>

                          <button
                            onClick={applyCustomDateRange}
                            className="block w-full rounded-md bg-primaryBackground p-2 text-white"
                          >
                            Download Sheet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {guestHouses.map((house: any) => (
                  <TabsContent key={house.value} value={house.value}>
                    <Card>
                      <CardContent>
                        <DataTable
                          selectedBooking={selectedBooking}
                          setSelectedBooking={setSelectedBooking}
                          columns={columns()}
                          header={house}
                          filterData={sortedAndFilteredData}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="w-5/6 sm:w-2/6">
              <Card className="w-fit ">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-base sm:text-lg">
                      Booking Id - {selectedBooking.id}
                    </CardTitle>
                    <CardDescription>
                      {selectedBooking.createdAt.toDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Hostel Name</div>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {removeUnderscore(selectedBooking.hostelName)}
                        </span>
                      </li>
                    </ul>
                    <Separator className="my-2" />
                    <div className="font-semibold">Room Details</div>
                    <ul className="grid gap-3">
                      {selectedBooking.rooms.map((r: any) => {
                        return (
                          <li
                            key={r.id}
                            className="flex items-center justify-between"
                          >
                            <span className="text-muted-foreground">
                              {r.code}
                            </span>
                            {/* <span>{r.rentPerDay}</span> */}
                          </li>
                        );
                      })}
                    </ul>
                    <Separator className="my-2" />
                    <div className="font-semibold">Guests Details</div>
                    <ul className="grid gap-3">
                      {selectedBooking.guests.map((g: any) => {
                        return (
                          <li
                            key={g.id}
                            className="flex flex-col items-start justify-start gap-1"
                          >
                            <p className="text-muted-foreground">
                              Name:{" "}
                              <span className="font-medium capitalize">
                                {" "}
                                {g.name}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Gmail:
                              <span className="font-medium capitalize">
                                {g.email}
                              </span>{" "}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>₹{selectedBooking.amount}</span>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-3">
                      <div className="font-semibold">Check In</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        <span>
                          {selectedBooking.bookedFromDt.toDateString()}
                        </span>
                      </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                      <div className="font-semibold">Check Out</div>
                      <div className="text-muted-foreground">
                        {selectedBooking.bookedToDt.toDateString()}
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <div className="font-semibold">Status</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        <span className="font-medium">
                          {selectedBooking.bookingStatus === "UNCONFIRMED"
                            ? "Pending"
                            : selectedBooking.bookingStatus}
                        </span>
                      </address>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Customer Name</dt>
                        <dd>{selectedBooking.userName}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>
                          <a href="mailto:">{selectedBooking.userEmail}</a>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>{selectedBooking.guests[0]?.mobileNo}</dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          Mode of Payment
                        </dt>
                        <dd>Pay at Hotel</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    <time dateTime="2023-11-23">
                      {new Date().toDateString()}
                    </time>
                  </div>
                  <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousBooking}
                          disabled={
                            sortedAndFilteredData.findIndex(
                              (booking) => booking.id === selectedBooking.id,
                            ) === 0
                          }
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="sr-only">Previous Order</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextBooking}
                          disabled={
                            sortedAndFilteredData.findIndex(
                              (booking) => booking.id === selectedBooking.id,
                            ) ===
                            sortedAndFilteredData.length - 1
                          }
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span className="sr-only">Next Order</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
