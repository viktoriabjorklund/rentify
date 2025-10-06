import * as React from 'react';
import PrimaryButton from '@/components/PrimaryButton';

import { displayTool } from "../services/toolService";
import { Tool } from "@/services/toolService";

import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from '@/components/Calendar';




export default function TooldetailsPage(){
    //const { isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();  
    const { id } = router.query;

    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const [tool, setTool] = React.useState<Tool | null >(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null >(null);
    const [events, setEvents] = React.useState([]);
    const [eventText, setEventText] = React.useState([]);

    React.useEffect(() => {
      if(id) {
        setLoading(true);
        displayTool(Number(id))
        .then(setTool)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      }
    }
    )
/*
    if (loading) return <p>Loading tool...</p>
    if (error) return <p className='text-red-600'>Error: {error}</p>
    if (!tool) return <p>No tool found</p>
*/
  
  return(
      <section  style={{ alignContent:'center'}}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Left side of page */}
            <section className='pl-10' style={{alignItems:'last-baseline'}}>

              <Calendar calendarSize={400} />



              {/* Submit */}
                <div className="flex justify-center">
                </div>
            </section>
            {/* Right side of page */}
            <section>
                <div className='table p-2 mb-2 mt-2 ml-15 text-center table-full w-7/10 bg-emerald-600 rounded-xl text-white'>
                    {/*[...Array([event]).keys()].map((id) => (<div key={id} className="bg-blue-200 rounded-xl text-white">{}</div>))*/}
                    {//events.map((event, index) => {
                        <div className=' key={index} table-row' > 
                            <div className='table-cell border-r border-white w-3/10'>
                                <div className=''>
                                   {// `${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()} ${event.date.getFullYear()}``
                                "Oct 9 2025"}</div>
                                <div>{/*event.time*/ "10:00"}</div>
                            </div>
                            <div className='table-cell'>{/*event.text*/ "Hammare"}</div>
                            <div className='event buttons'>
                                <button></button>
                            </div>
                        </div>
                        /*})*/}
                </div>

            </section>
          </div>

          </div>
          </section>
    );
  }