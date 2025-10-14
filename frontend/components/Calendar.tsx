import React from "react";
let oldkey = ""

type ButtonProps = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  calendarSize: number;
  bookings: any[];
};

export function setItem(key: string, value: unknown) {
  try {
    if (oldkey != key){
    localStorage.setItem(key, JSON.stringify(value));
    oldkey = key
    window.dispatchEvent(new Event("storage"));}
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
}


export default function Calendar({disabled, calendarSize, bookings}:ButtonProps){
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentDate = new Date() 
  const [currentMonth, setCurrentMonth] = React.useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = React.useState(currentDate.getFullYear())
  const [startDate, setStartDate] = React.useState(currentDate)
  const [endDate, setEndDate] = React.useState(currentDate)
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 0).getDay()
  
  {React.useEffect(()=>{setItem('startdate',startDate)})}
  {React.useEffect(()=>{setItem('enddate',endDate)})}

  async function prevMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11: prevMonth - 1))
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
  }

  async function nextMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0: prevMonth + 1))
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
  }

    async function handleDayClick(day:number) {
        const clickedDate = new Date(currentYear, currentMonth, day)
        const today = new Date()

        if (clickedDate >= today){
            clickedDate < startDate || startDate.getDate()==currentDate.getDate() || startDate.getDate() < endDate.getDate() && startDate.getMonth() >= endDate.getMonth() 
                ? (setStartDate(clickedDate), setEndDate(clickedDate))
                : (clickedDate.getDate() > startDate.getDate() && startDate.getDate() != currentDate.getDate() && startDate.getDate() != clickedDate.getDate())
                ? setEndDate(clickedDate)
                : setEndDate(clickedDate)
            }
    }

    function classNames(...classes:any[]){
        return(classes.filter(Boolean).join(' '))
    }

    function showBookings(day:number, version:number){
      if (bookings){
      return (
        //version==1?
        <div className="text-black text-[0.5rem] overflow-hidden"> 
       {bookings.map((booking)=>(
        new Date(booking.startDate).getMonth() == currentMonth && 
              new Date(booking.startDate).getDate()<= day && day <= new Date(booking.endDate).getDate())
        ?  booking.tool.name
        : ''
        ) }
        </div>)
      /*:   (bookings.map((booking)=>(
        new Date(booking.startDate).getMonth() == currentMonth 
        ? new Date(booking.startDate).getDate()== day && day != new Date(booking.endDate).getDate()
            ? 'bg-emerald-200 rounded-s-xl' 
          : day == new Date(booking.endDate).getDate() && day != new Date(booking.startDate).getDate()
            ? 'bg-emerald-200  rounded-se-xl rounded-ee-xl'
          : new Date(booking.startDate).getDate()< day && day < new Date(booking.endDate).getDate()
            ? 'bg-emerald-200 '
          : new Date(booking.startDate).getDate()== day && day == new Date(booking.endDate).getDate()
          ? 'bg-emerald-200 rounded-xl'
          : ' '
        :' '))))}*/
      }}
        
      
    

    return(
    
    <div className="calendar grid grid-cols-1 content-center" style={{maxWidth:calendarSize}}>
        <div className="navigate-date grid grid-cols-1 md:grid-cols-4 gap-8 h-8">
            <button type='button' onClick={prevMonth} className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Previous Month</span>
                 {"<"}
            </button>
                <h3 className="month mt-1 pr-2 font-semibold text-left">{monthsOfYear[currentMonth]}</h3>
                <h3 className="year mt-1 font-semibold text-right">{currentYear}</h3>
             <button type='button' onClick={nextMonth} className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Next Month</span>
                 {">"}
            </button>
        </div>
        <div className="weekdays text-gray-400 grid grid-cols-1 md:grid-cols-7 gap-2">
            {daysOfWeek.map((day)=> <span key={day}>{day}</span>)}
        </div>
        <div className="grid grid-cols-5 md:grid-cols-7" style={{alignContent:'center'}}>
            {[...Array(firstDayOfMonth).keys()].map((_, index)=> (
                <span key={`empty-${index}`} />
            ))}
            {[...Array(daysInMonth).keys()].map((day) => (
              <div key={day + 1} className="grid grid-cols-2 md:grid-cols-1">
               <button /*key={day + 1}*/className={classNames(
                    'pt-1 pb-1 text-center mt-1 mb-1 h-[2rem] ',
                    day+1 ==currentDate.getDate() && currentMonth==currentDate.getMonth() 
                    && currentYear==currentDate.getFullYear() && 'text-emerald-800 text-center rounded-xl bg-gray-200',
                    day+1 < currentDate.getDate() && currentMonth==currentDate.getMonth() 
                    && currentYear==currentDate.getFullYear() && 'text-gray-400',
                    currentMonth < currentDate.getMonth() 
                    && currentYear <= currentDate.getFullYear() && 'text-gray-400',
                    day+1 == startDate.getDate() && currentMonth ==startDate.getMonth() 
                    && currentYear==startDate.getFullYear()&& startDate.getDate() == endDate.getDate() && 'bg-emerald-500 rounded-xl',
                    day+1 == startDate.getDate() && currentMonth ==startDate.getMonth() 
                    && currentYear==startDate.getFullYear()&& endDate.getDate()!=startDate.getDate() && 'bg-emerald-500 rounded-s-xl',
                    day+1 == endDate.getDate() && currentMonth ==endDate.getMonth() 
                    && currentYear==endDate.getFullYear() &&
                    day+1 != startDate.getDate()&&'bg-emerald-500 rounded-se-xl rounded-ee-xl',
                    day+1 > startDate.getDate() && currentMonth ==startDate.getMonth() 
                    && currentYear==startDate.getFullYear() && day+1 < endDate.getDate() && currentMonth ==endDate.getMonth() 
                    && currentYear==endDate.getFullYear() && 'bg-emerald-500'
                    //showBookings(day+1, 0)
                  )} onClick={() => (handleDayClick(day+1))}
                >{day + 1 }</button> 
                  {showBookings(day+1,1)}
                </div>
            ))}
        </div>
        <div className="events">
           <div className='p-2 mb-2 mt-2 ml-[2rem] text-center table table-full rounded-full bg-gray-200 w-[20rem]'>
              <div className="table-row">
                <div className="table-cell border-r border-gray-400">Start Date </div>
                <div className="table-cell">End Date</div>
                </div>
                <div className="table-row">
                <p className="table-cell border-r text-gray-400">{daysOfWeek[startDate.getDay()]+ " " + startDate.getDate() + " " + monthsOfYear[startDate.getMonth()]}</p>
                <p className="table-cell  text-gray-400">{ daysOfWeek[endDate.getDay()]+ " " + endDate.getDate() + " " + monthsOfYear[endDate.getMonth()]} </p>
              </div>
            </div>
              
        </div>
    </div>
  )
};