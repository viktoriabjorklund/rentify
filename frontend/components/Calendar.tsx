import React from "react";
let oldkey = [new Date(), new Date()];

type ButtonProps = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  calendarSize: number;
  bookings: any[];
  currentUserId?: number;
};

export function setItem(key: string, value: Date) {
  try {
    if (oldkey[0] != value && key == "startdate") {
      localStorage.setItem(key, JSON.stringify(value));
      oldkey[0] = value;
      window.dispatchEvent(new Event("storage"));
    }

    if (oldkey[1] != value && key == "enddate") {
      localStorage.setItem(key, JSON.stringify(value));
      oldkey[1] = value;
      window.dispatchEvent(new Event("storage"));
    }
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
}

export default function Calendar({
  disabled,
  calendarSize,
  bookings,
  currentUserId,
}: ButtonProps) {
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
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    currentDate.getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState(
    currentDate.getFullYear()
  );
  const [startDate, setStartDate] = React.useState(currentDate);
  const [endDate, setEndDate] = React.useState(currentDate);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 0).getDay();

  React.useEffect(() => {
    setItem("startdate", startDate);
  });
  React.useEffect(() => {
    setItem("enddate", endDate);
  });

  async function prevMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  }

  async function nextMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  }

  async function handleDayClick(day: number) {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();

    if (clickedDate >= today) {
      clickedDate < startDate ||
      startDate.getDate() == currentDate.getDate() ||
      (startDate.getDate() < endDate.getDate() &&
        startDate.getMonth() >= endDate.getMonth()) ||
      bookings.length > 0
        ? (setStartDate(clickedDate), setEndDate(clickedDate))
        : clickedDate.getDate() > startDate.getDate() &&
          startDate.getDate() != currentDate.getDate() &&
          startDate.getDate() != clickedDate.getDate()
        ? (setEndDate(clickedDate))
        : startDate.getMonth()<clickedDate.getMonth()&&endDate.getMonth()==clickedDate.getMonth()
        ? (setStartDate(clickedDate), setEndDate(clickedDate))
        : (setEndDate(clickedDate));
    }
  }

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  function showBookings(day: number) {
    if (bookings) {
      return (
        <div className="text-black text-[0.5rem] h-[1.2rem] w-[3rem] overflow-auto align-left">
          {bookings.map((booking) =>
            new Date(booking.startDate).getMonth() == currentMonth &&
            new Date(booking.startDate).getDate() <= day &&
            day <= new Date(booking.endDate).getDate() ? (
              <div key={booking.id} className="flex space-x-0 h-[0.5rem]">
                <svg className="w-[0.8rem]" viewBox="0 0 24 24">
                  <circle
                    cx={10}
                    cy={18}
                    r={5}
                    fill={
                      booking?.renter?.id === currentUserId
                        ? "#2C80EA"
                        : "Green"
                    }
                    stroke={
                      booking?.renter?.id === currentUserId
                        ? "#2C80EA"
                        : "Green"
                    }
                  />
                </svg>
                {booking.tool.name}
              </div>
            ) : (
              ""
            )
          )}
        </div>
      );
    }
  }

  return (
    <div
      className="calendar grid grid-cols-1 content-center"
      style={{ maxWidth: calendarSize }}
    >
      <div className="navigate-date grid grid-cols-1 md:grid-cols-4 gap-8 h-8">
        <button
          type="button"
          onClick={prevMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous Month</span>
          {"<"}
        </button>
        <h3 className="month mt-1 pr-2 font-semibold text-left">
          {monthsOfYear[currentMonth]}
        </h3>
        <h3 className="year mt-1 font-semibold text-right">{currentYear}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next Month</span>
          {">"}
        </button>
      </div>
      <div className="weekdays text-gray-400 grid grid-cols-1 md:grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div
        className="grid grid-cols-5 md:grid-cols-7"
        style={{ alignContent: "center" }}
      >
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {[...Array(daysInMonth).keys()].map((day) => (
          <div key={day + 1} className="grid grid-cols-2 md:grid-cols-1">
            <button
              /*key={day + 1}*/ className={classNames(
                "pt-1 pb-1 text-center mt-1 mb-1 h-[2rem] ",
                day + 1 == currentDate.getDate() &&
                  currentMonth == currentDate.getMonth() &&
                  currentYear == currentDate.getFullYear() &&
                  "text-emerald-800 text-center rounded-xl bg-gray-200",
                day + 1 < currentDate.getDate() &&
                  currentMonth == currentDate.getMonth() &&
                  currentYear == currentDate.getFullYear() &&
                  "text-gray-400",
                currentMonth < currentDate.getMonth() &&
                  currentYear <= currentDate.getFullYear() &&
                  "text-gray-400",
                day + 1 == startDate.getDate() &&
                  currentMonth == startDate.getMonth() &&
                  currentYear == startDate.getFullYear() &&
                  startDate.getDate() == endDate.getDate() &&
                  "bg-emerald-500 rounded-xl",
                day + 1 == startDate.getDate() &&
                  currentMonth == startDate.getMonth() &&
                  currentYear == startDate.getFullYear() &&
                  endDate.getDate() != startDate.getDate() &&
                  "bg-emerald-500 rounded-s-xl",
                day + 1 == endDate.getDate() &&
                  currentMonth == endDate.getMonth() &&
                  currentYear == endDate.getFullYear() &&
                  day + 1 != startDate.getDate() &&
                  "bg-emerald-500 rounded-se-xl rounded-ee-xl",
                day + 1 > startDate.getDate() &&
                  currentMonth == startDate.getMonth() &&
                  currentYear == startDate.getFullYear() &&
                  currentMonth < endDate.getMonth() &&
                  currentYear == endDate.getFullYear() &&
                  "bg-emerald-500",
                  currentMonth > startDate.getMonth() &&
                  currentYear == startDate.getFullYear() &&
                  day + 1 < endDate.getDate() &&
                  currentMonth == endDate.getMonth() &&
                  currentYear == endDate.getFullYear() &&
                  "bg-emerald-500",
                  day + 1 > startDate.getDate() &&
                  currentMonth == startDate.getMonth() &&
                  currentYear == startDate.getFullYear() &&
                  day + 1 < endDate.getDate() &&
                  currentMonth == endDate.getMonth() &&
                  currentYear == endDate.getFullYear() &&
                  "bg-emerald-500"
              )}
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </button>
            <div className="h-[1.2rem]">{showBookings(day + 1)}</div>
          </div>
        ))}
      </div>
      <div className="start/enddates mb:w-40 align-center">
        <div className="p-2 mb-2 mt-2 ml-[2rem] text-center table table-full rounded-full bg-gray-200 mb:w-40">
          <div className="table-row">
            <div className="table-cell border-r border-gray-400">
              Start Date{" "}
            </div>
            <div className="table-cell">End Date</div>
          </div>
          <div className="table-row w-40">
            <p className="table-cell w-[15rem] border-r text-gray-400 p-1">
              {daysOfWeek[
                startDate.getDay() == 0 ? 6 : startDate.getDay() - 1
              ] +
                " " +
                startDate.getDate() +
                " " +
                monthsOfYear[startDate.getMonth()]}
            </p>
            <p className="table-cell w-[15rem] text-gray-400 p-1">
              {daysOfWeek[
                endDate.getDay() == 0 ? 6 : endDate.getDay() - 1
              ] +
                " " +
                endDate.getDate() +
                " " +
                monthsOfYear[endDate.getMonth()]}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
