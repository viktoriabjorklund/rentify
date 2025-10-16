import * as React from "react";
import { ContactDialog } from "@/components/dialogs/ContactDialog";
import { getBookings, Booking } from "../services/bookingService";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from "@/components/Calendar";

// Function for getting dates from local storage
export function getItem(key: string) {
  try {
    const item = localStorage.getItem(key);
    window.removeEventListener("storage", () => {});
    return item ? new Date(JSON.parse(item)) : undefined;
  } catch (error) {
    console.error("Error reading from localStorage", error);
  }
}

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const [contactPerson, setContactPerson] = React.useState<{
    name: string;
    email?: string;
  } | null>(null);

  const handleContact = (name?: string, email?: string) => {
    setContactPerson({ name: name || "Unknown", email });
    setContactDialogOpen(true);
  };

  async function highlightBooking(startdate: Date, enddate: Date) {
    let bookingList: number[] = [];
    bookings?.forEach((booking) => {
      if (
        new Date(booking.startDate).getMonth() === startdate.getMonth() &&
        new Date(booking.startDate).getDate() <= startdate.getDate() &&
        enddate.getDate() <= new Date(booking.endDate).getDate()
      ) {
        bookingList = bookingList.concat(booking.id);
      }
    });
    setHightlight(bookingList);
  }

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [highlight, setHightlight] = React.useState<number[] | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      highlightBooking(
        getItem("startdate") || new Date(),
        getItem("enddate") || new Date()
      );
    });
  });

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid mb-4"></div>
          <p className="text-emerald-900 text-lg font-medium">Loading bookings...</p>
        </div>
      </section>
    );
  }

  if (bookings && bookings.length > 0) {
    return (
      <section style={{ alignContent: "center" }}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left side of page */}
            <section className="pl-[8rem]" style={{ alignItems: "last-baseline" }}>
              <Calendar calendarSize={400} bookings={bookings} />
            </section>

            {/* Right side of page */}
            <section className="h-100 overflow-auto">
              <div className="table p-2 mb-2 mt-2 ml-15 text-center table-full w-7/10 bg-white rounded-xl text-white overflow-auto">
                {bookings
                  .toSorted(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime()
                  )
                  .map((booking) => {
                    const userId =
                      user?.id ?? Number(localStorage.getItem("userId"));
                    const isMyTool = booking.tool?.user?.id === userId;
                    const isMyBooking = booking.renter?.id === userId;

                    return (
                      <div
                        key={booking.id}
                        className={classNames(
                          `rounded-xl text-white m-2 p-2 pt-4 pb-4`,
                          highlight?.includes(booking.id)
                            ? "bg-emerald-400"
                            : "bg-emerald-600"
                        )}
                      >
                        <div className="table-row">
                          <div className="table-cell border-r border-white pr-1 w-[30rem]">
                            <div>
                              {`${monthsOfYear[
                                new Date(booking.startDate).getMonth()
                              ]} ${new Date(
                                booking.startDate
                              ).getDate()} ${new Date(
                                booking.startDate
                              ).getFullYear()}`}
                            </div>
                            <div>
                              {"to " +
                                `${monthsOfYear[
                                  new Date(booking.endDate).getMonth()
                                ]} ${new Date(
                                  booking.endDate
                                ).getDate()} ${new Date(
                                  booking.endDate
                                ).getFullYear()}`}
                            </div>
                          </div>

                          <div className="table-cell pl-5 text-center w-[40rem]">
                            {isMyTool ? (
                              <>
                                <span>
                                  {booking.renter?.name ||
                                    booking.renter?.username}
                                </span>{" "}
                                will borrow your{" "}
                                <span>{booking.tool?.name}</span>.
                                <br />
                                Contact{" "}
                                <button
                                  onClick={() =>
                                    handleContact(
                                      booking.renter?.name ||
                                        booking.renter?.username,
                                      booking.renter?.username
                                    )
                                  }
                                  className="font-semibold underline hover:text-emerald-200 cursor-pointer"
                                >
                                  {booking.renter?.name ||
                                    booking.renter?.username}
                                </button>
                              </>
                            ) : (
                              <>
                                You will borrow{" "}
                                <span>
                                  {booking.tool?.user?.name ||
                                    booking.tool?.user?.username}
                                  ’s {booking.tool?.name}
                                </span>
                                .<br />
                                Contact{" "}
                                <button
                                  onClick={() =>
                                    handleContact(
                                      booking.tool?.user?.name ||
                                        booking.tool?.user?.username,
                                      booking.tool?.user?.username
                                    )
                                  }
                                  className="font-semibold underline hover:text-emerald-200 cursor-pointer"
                                >
                                  {booking.tool?.user?.name ||
                                    booking.tool?.user?.username}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          </div>
        </div>

        {/* Contact Dialog */}
        <ContactDialog
          isOpen={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          email={contactPerson?.email}
          ownerName={contactPerson?.name}
        />
      </section>
    );
  } else {
    return (
      <section style={{ alignContent: "center" }}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left side of page */}
            <section className="pl-10" style={{ alignItems: "last-baseline" }}>
              <Calendar calendarSize={400} bookings={[]} />
            </section>

            {/* Right side of page */}
            <section>
              <div className="text-center text-black text-xl">
                No bookings yet
              </div>
            </section>
          </div>
        </div>
      </section>
    );
  }
}
