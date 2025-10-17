import * as React from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import { displayTool } from "../services/toolService";
import { Tool } from "@/services/toolService";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from '@/components/Calendar';
import { useRequestSubmit } from "../hooks/requests";
import {createRequest} from "../services/requestService";

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

export default function TooldetailsPage(){
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();  
    const { id } = router.query;
    const [firstLoad, setFirstLoad] = React.useState(true)

    const [tool, setTool] = React.useState<Tool | null >(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null >(null);
    const [totalDays, setTotalDays] = React.useState(0)
    
    // Use ViewModel hook for request submission
    const { submitRequest, submitting, error: submitError } = useRequestSubmit();

    React.useEffect(() => {
      if(firstLoad){
      if(id) {
        setLoading(true);
        displayTool(Number(id))
        .then(setTool)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
        setFirstLoad(false)
      }}
      
    }
    )

    React.useEffect(()=>{window.addEventListener('storage', () => {
    changeTotal(getItem('startdate')||new Date(), getItem('enddate')||new Date())})})

    if (loading) {
      return (
        <main className="flex flex-col items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 mt-2">Loading tool...</p>
        </main>
      );
    }
    if (error || submitError) return <p className='text-red-600'>Error: {error || submitError}</p>
    if (!tool) return <p>No tool found</p>

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    // Show loading while checking authentication
    if (authLoading) {
      return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </main>
      );
    }
  
    // Don't render anything if not authenticated (redirect will happen)
    if (!isAuthenticated) {
      return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </main>
      );
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!tool) {
      console.info("No tool");
      return;
    }
    
    // Use ViewModel hook - handles API call, confetti, and navigation
    await submitRequest({ 
      startDate: getItem("startdate") || new Date(), 
      endDate: getItem("enddate") || new Date(), 
      toolId: tool.id, 
      price: tool.price, 
      pending: true, 
      accepted: false 
    });
  }

async function changeTotal(startdate:Date, enddate:Date){
      setTotalDays((enddate.getDate()-startdate.getDate())+(enddate.getMonth()-startdate.getMonth()) + (enddate.getFullYear()-startdate.getFullYear()))
    }

  return(
      <section  style={{ alignContent:'center'}}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Left side of page */}
            <section className='w-1/1 pl-10'>
                {/* Image of tool*/}
                <div className="aspect-[18/10] w-full bg-gray-200 rounded-xl overflow-hidden">
                  {tool.photoURL ? (
                    <img src={tool.photoURL} alt={tool.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
              
                {/* Title, place and price under tool*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 " >
                  <h2 className="text-2xl font-bold text-black">
                    {tool.name}
                  </h2>
                  <h2  className="text-2xl font-bold text-black">
                  {tool.price + " kr/day"}
                  </h2>
                  <h2 className="text-2xl font-thin text-black">
                  {tool.location}
                  </h2>
                </div>

                {/*Profile pic & name*/}
                <section >
                <div className="mt-5 mb-5 grid grid-cols-1 md:grid-cols-2 text-black w-5/10">
                  <img src="/profilepic.png" alt="" className='w-5/10'/>
                    <p className="text-2s font-bold text-left text-black pt-4">
                    {(tool.user?.name + " " + tool.user?.surname) || tool.user?.username}
                    </p>
                </div>
                </section>

                {/* Description */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-8 text-left w-8/10">
                  <p className="mt-3 text-black" style={{ fontSize: "0.9rem" }}>
                  {tool.description}
                  </p>
                </div>
                
            </section>

            {/* Right side of page */}
            <section className='pl-10' style={{alignItems:'last-baseline'}}>
              <Calendar calendarSize={400} bookings={[]} />
          
              <div className='content-center ml-5 pl-25 table table-full'>
                  <p className='text-lg pb-2 pl-5 pr-5 table-cell border-b border-gray-400'>{"Total price: "+ ((totalDays+1)*tool.price)}</p>
              </div>

              {/* Submit */}
                <div className="content-center p-3 ml-[7.3rem]">
                  <PrimaryButton type="submit" disabled={submitting} size="md" onClick={onSubmit}>
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Request...
                      </span>
                    ) : 'Send Request'}
                  </PrimaryButton>
                </div>
            </section>
          </div>

          </div>
          </section>
    );
  }