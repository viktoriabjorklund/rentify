import * as React from 'react';


import {getBookings, Booking} from "../services/bookingService";

import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from '@/components/Calendar';


export default function BookingsPage(){
   //const { isLoading: authLoading, isAuthenticated } = useAuth();
   const router = useRouter(); 


   const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

   const [loading, setLoading] = React.useState(true);
   const [error, setError] = React.useState<string | null >(null);
   const [bookings, setBookings] = React.useState<Booking[] | null>(null);
   const { isLoading: authLoading, isAuthenticated } = useAuth();

    const [firstLoad, setFirstLoad] = React.useState(true);

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

    if (bookings && bookings.length > 0 ){
      //if (firstLoad){
        //setFirstLoad(false)
        //setBookings(bookings.toSorted((a,b)=>(
          //    new Date(a.startDate).getMonth()*new Date(a.startDate).getDate() - new Date(b.startDate).getMonth()*new Date(b.startDate).getDate())))
     // }
  return(
     <section  style={{ alignContent:'center'}}>
       <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
         <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
          
           {/* Left side of page */}
           <section className='pl-10' style={{alignItems:'last-baseline'}}>
             <Calendar calendarSize={400} />
           </section>

           {/* Right side of page */}
           <section className='h-100 overflow-auto'>
               <div className='table p-2 mb-2 mt-2 ml-15 text-center table-full w-7/10 bg-white rounded-xl text-white overflow-auto'>
                   {/*[...Array([bookings]).keys()].map((index) => (*/}
                   {bookings.toSorted(function(a,b){
                    var c = new Date(a.startDate)
                    var d = new Date(b.startDate)
                    if (c.getFullYear()<=d.getFullYear()){
                      if (c.getMonth()<=d.getMonth()){
                        return c.getDate()-d.getDate()
                      } 
                      else {
                         return d.getDate()-c.getDate()
                      }
                    } else {return d.getDate()-c.getDate()}}).map((booking, index) => (
                    <div key={index} className="bg-emerald-600 rounded-xl text-white m-2 p-2 pt-4 pb-4">
                       <div className=' key={index} table-row ' >
                           <div className='table-cell border-r border-white pr-1 w-40 '>
                               <div className=''>
                                  { `${monthsOfYear[new Date(booking.startDate).getMonth()]} ${new Date(booking.startDate).getDate()} ${new Date(booking.startDate).getFullYear()}`
                               }</div>
                               <div>{"to "+`${monthsOfYear[new Date(booking.endDate).getMonth()]} ${new Date(booking.endDate).getDate()} ${new Date(booking.endDate).getFullYear()}`
                                }</div>
                                </div>
                           <div className='table-cell pl-5 text-center'>
                           {booking.tool.name
                            }
                           </div> 
                       </div>
                       </div>))}
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
             <Calendar calendarSize={400} />
           </section>

           {/* Right side of page */}
           <section>
              <div className='text-center texxt-black text-xl'>
                {"No bookings yet"}
              </div>
                      </section>
                      </div>
         </div>
         </section>)}}

