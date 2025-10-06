import React from "react";

type ButtonProps = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  calendarSize: number;
};

export default function Calendar({disabled, calendarSize}:ButtonProps){
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentDate = new Date() 
  const [currentMonth, setCurrentMonth] = React.useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = React.useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = React.useState(currentDate)
  const [selectedSecondDate, setSelectedSecondDate] = React.useState(currentDate)
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 0).getDay()
  

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
            clickedDate < selectedDate || selectedDate.getDate()==currentDate.getDate() || selectedDate.getDate() < selectedSecondDate.getDate() && selectedDate.getMonth() >= selectedSecondDate.getMonth() 
                ? (setSelectedDate(clickedDate), setSelectedSecondDate(clickedDate))
                : clickedDate.getDate() > selectedDate.getDate() && selectedDate.getDate() != currentDate.getDate() && selectedDate.getDate() != clickedDate.getDate()
                ? setSelectedSecondDate(clickedDate)
                : setSelectedSecondDate(currentDate)
            }
            console.log(selectedDate + " " + selectedSecondDate)      
    }

    function classNames(...classes){
        return(classes.filter(Boolean).join(' '))
    }

   function generateDates(){
    return(
        <div className="grid grid-cols-5 md:grid-cols-7" style={{alignContent:'center'}}>
            {[...Array(firstDayOfMonth).keys()].map((_, index)=> (
                <span key={`empty-${index}`}/>
            ))}
            {[...Array(daysInMonth).keys()].map((day) => (
               /*<div className="bg-gray-200">*/ <button key={day + 1} className={classNames(
                    'pt-1 pb-1 text-center h-9 mt-1 mb-1',
                    day+1 ==currentDate.getDate() && currentMonth==currentDate.getMonth() 
                    && currentYear==currentDate.getFullYear() && 'text-emerald-800 text-center rounded-full bg-gray-200', 
                    '',
                    day+1 < currentDate.getDate() && currentMonth==currentDate.getMonth() 
                    && currentYear==currentDate.getFullYear() && 'text-gray-400',
                    currentMonth < currentDate.getMonth() 
                    && currentYear <= currentDate.getFullYear() && 'text-gray-400',
                    day+1 == selectedDate.getDate() && currentMonth ==selectedDate.getMonth() 
                    && currentYear==selectedDate.getFullYear()&& selectedSecondDate.getDate()<=selectedDate.getDate() && 'bg-emerald-500 rounded-xl',
                    day+1 == selectedDate.getDate() && currentMonth ==selectedDate.getMonth() 
                    && currentYear==selectedDate.getFullYear()&& selectedSecondDate.getDate()!=currentDate.getDate() && 'bg-emerald-500 rounded-s-xl',
                    day+1 == selectedSecondDate.getDate() && currentMonth ==selectedSecondDate.getMonth() 
                    && currentYear==selectedSecondDate.getFullYear() &&
                    day+1 != selectedDate.getDate()&&'bg-emerald-500 rounded-se-xl rounded-ee-xl',
                    day+1 > selectedDate.getDate() && currentMonth ==selectedDate.getMonth() 
                    && currentYear==selectedDate.getFullYear() && day+1 < selectedSecondDate.getDate() && currentMonth ==selectedSecondDate.getMonth() 
                    && currentYear==selectedSecondDate.getFullYear() && 'bg-emerald-500'
                  )} onClick={() => handleDayClick(day+1)}
                >{day + 1}</button>//</div>
            ))}
        </div>)
    }

    return(
    <div className="calendar" style={{maxWidth:calendarSize}}>
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
        <div className="weekdays text-gray-400 grid grid-cols-1 md:grid-cols-7 gap-2" style={{width:calendarSize}}>
            {daysOfWeek.map((day)=> <span key={day}>{day}</span>)}
        </div>
        {generateDates()}
        <div className="events">
        </div>
    </div>
  )
};