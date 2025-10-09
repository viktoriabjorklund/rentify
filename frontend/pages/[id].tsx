import * as React from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import { displayTool } from "../services/toolService";
import { Tool } from "@/services/toolService";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Calendar from '@/components/Calendar';
import {createRequest} from "@/services/requestService";

export function getItem(key: string) {
  try {
    const item = localStorage.getItem(key);
    window.removeEventListener('storage', ()=> {})
    return (item ? JSON.parse(item) : undefined)
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
}

export default function TooldetailsPage(){
    const { isLoading: authLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();  
    const { id } = router.query;
    const [firstLoad, setFirstLoad] = React.useState(true)

    const [tool, setTool] = React.useState<Tool | null >(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null >(null);
    const [totalDays, setTotalDays] = React.useState(0)

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
    changeTotal(getItem('startdate'), getItem('enddate'))})})

    if (loading) return <p>Loading tool...</p>
    if (error) return <p className='text-red-600'>Error: {error}</p>
    if (!tool) return <p>No tool found</p>

  async function onSubmit(e: React.FormEvent) {
  
    // Show loading while checking authentication
    if (authLoading) {
      return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
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

    const success = await createRequest({ renterId: tool?.user.id, startDate: getItem("startdate"), endDate:getItem("enddate"), toolId:tool?.id || 2, pending:true, accepted:false });
    
    if (success) {
      router.push('/');
    }
  }

async function changeTotal(startdate:any[], enddate:any[]){
      setTotalDays((enddate[0]-startdate[0])+(enddate[1]-startdate[1]) + (enddate[2]-startdate[2]))
    }

  return(
      <section  style={{ alignContent:'center'}}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 mr-15 ml-15 mb-10 mt-10">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Left side of page */}
            <section className='w-1/1 pl-10'>
                {/* Image of tool*/}
                <img src="https://verktygsboden.se/pub_images/original/87907.jpg" className='w-7/10' alt="Placeholder pic of hammer"/>
              
                {/* Title, place and price under tool*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 " >
                  <h2 className="text-2xl font-bold text-black">
                    {tool.name}
                  </h2>
                  <h2  className="text-2xl font-bold text-black">
                  {tool.price + " kr/day"}
                  </h2>
                  <h2 className="text-2xl font-thin text-black">
                  {tool.location +
                  console.log(tool.user)}
                  </h2>
                </div>

                {/*Profile pic, name & stars*/}
                <section className='w-3/10'>
                <div className="mt-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                  <img src="/profilepic.png" alt="" />
                  <div className='grid grid-cols-2 md:grid-cols-1'>
                    <img src="/star (1).png"  alt='star' className='w-2/10'/>
                    <p className="text-2s font-bold text-black">
                    {tool.user.name || tool.user.username}
                    </p>
                 </div>
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

              <Calendar calendarSize={400} />
          
              <div className='content-center ml-5 pl-25 table table-full'>
                  <p className='text-lg pb-2 pl-5 pr-5 table-cell border-b border-gray-400'>{"Total price: "+ (totalDays+1)*tool.price}</p>
              </div>

              {/* Submit */}
                <div className="content-center p-3 ml-32">
                  <PrimaryButton type="submit" disabled={loading} size="md" onClick={onSubmit}>
                    {loading ? 'Sending Request...' : 'Send Request'}
                  </PrimaryButton>
                </div>
            </section>
          </div>

          </div>
          </section>
    );
  }