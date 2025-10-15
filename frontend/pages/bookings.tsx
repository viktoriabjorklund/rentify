import * as React from 'react';


import {getBookings, Booking} from "../services/bookingService";

import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from '@/components/Calendar';

// function for gettiung dates from local storage
export function getItem(key: string) {
  try {
    const item = localStorage.getItem(key);
    window.removeEventListener('storage', ()=> {})
    return (item ? new Date(JSON.parse(item)) : undefined)
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
}

export default function BookingsPage(){
   //const { isLoading: authLoading, isAuthenticated } = useAuth();
   const router = useRouter(); 


  async function highlightBooking(startdate:Date, enddate:Date){
    let bookingList: number[] = []
    bookings?.forEach((booking) => {
      if (new Date(booking.startDate).getMonth() == startdate.getMonth() && 
              new Date(booking.startDate).getDate()<= startdate.getDate() && enddate.getDate() <= new Date(booking.endDate).getDate()){
                bookingList = bookingList.concat(booking.id)
        //return ("bg-emerald-400")
      }
      //else{return 'bg-emerald-600'}
    })
    setHightlight(bookingList)
    //return ("bg-emerald-400")
  }

  function classNames(...classes:any[]){
        return(classes.filter(Boolean).join(' '))
    }

   const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

   const [loading, setLoading] = React.useState(true);
   const [error, setError] = React.useState<string | null >(null);
   const [bookings, setBookings] = React.useState<Booking[] | null>(null);
   const { isLoading: authLoading, isAuthenticated } = useAuth();
   const [highlight, setHightlight] = React.useState<number[] |null>(null);


    React.useEffect(() => {
          async function load(){
          try{
            setLoading(true);
            getBookings()
            .then(setBookings)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
          }catch (e: any) {
            setError(e.message ?? String(e));
          } finally {
            setLoading(false);
          }}
        load()}
          )

    React.useEffect(()=>{window.addEventListener('storage', () => {
          highlightBooking(getItem('startdate') || new Date(), getItem('enddate')  || new Date())
      })
    })

    if (bookings && bookings.length > 0 ){
      return(
        <section  style={{ alignContent:'center'}}>
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
              
              {/* Left side of page */}
              <section className='pl-[8rem]' style={{alignItems:'last-baseline'}}>
                <Calendar calendarSize={400} bookings={bookings}/>
              </section>

              {/* Right side of page */}
              <section className='h-100 overflow-auto'>
                  <div className='table p-2 mb-2 mt-2 ml-15 text-center table-full w-7/10 bg-white rounded-xl text-white overflow-auto'>
                      {/*[...Array([bookings]).keys()].map((index) => (*/}
                      {bookings.toSorted(
                          function(a,b){
                          let c = new Date(a.startDate)
                          let d = new Date(b.startDate)
                          if (c.getFullYear()<=d.getFullYear()){
                            if (c.getMonth()<=d.getMonth()){
                              return c.getDate()-d.getDate()
                            } 
                            else {
                              return d.getDate()-c.getDate()
                            }
                          } else {return d.getDate()-c.getDate()}
                          }
                      ).map((booking) => (
                        <div key={booking.id} className={classNames(`rounded-xl text-white m-2 p-2 pt-4 pb-4`,  highlight?.includes((booking.id))? 'bg-emerald-400':'bg-emerald-600')}>
                          <div className=' key={index} table-row ' >
                              <div className='table-cell border-r border-white pr-1 w-[30rem] '>
                                  <div className=''>
                                      { `${monthsOfYear[new Date(booking.startDate).getMonth()]} ${new Date(booking.startDate).getDate()} ${new Date(booking.startDate).getFullYear()}`
                                  }</div>
                                  <div>{"to "+`${monthsOfYear[new Date(booking.endDate).getMonth()]} ${new Date(booking.endDate).getDate()} ${new Date(booking.endDate).getFullYear()}`
                                    }</div>
                                    </div>
                              <div className='table-cell pl-5 text-center w-[40rem]'>
                              {booking.tool.name
                                }
                              </div> 
                          </div>
                          </div> 
                        ))}
                      </div> 
                    </section>
                </div>
            </div>
            </section>
      );
    }
 else {return (<section  style={{ alignContent:'center'}}>
       <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
         <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
          
           {/* Left side of page */}
           <section className='pl-10' style={{alignItems:'last-baseline'}}>
             <Calendar calendarSize={400} bookings={[]}/>
           </section>

           {/* Right side of page */}
           <section>
              <div className='text-center text-black text-xl'>
                {"No bookings yet"}
              </div>
                      </section>
                      </div>
         </div>
         </section>)}}

