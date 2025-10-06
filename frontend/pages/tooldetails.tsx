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

    const [tool, setTool] = React.useState<Tool | null >(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null >(null);

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
            <section className='w-1/1 pl-10'>
                {/* Image of tool*/}
                <img src="https://verktygsboden.se/pub_images/original/87907.jpg" className='w-7/10' alt="Placeholder pic of hammer"/>
              
                {/* Title, place and price under tool*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 " >
                  <h2 className="text-2xl font-bold text-black">
                    {/*tool.name*/ "hammare"}
                  </h2>
                  <h2  className="text-2xl font-bold text-black">
                  {/*tool.price + */"50 kr/day"}
                  </h2>
                  <h2 className="text-2xl font-thin text-black">
                  {"place"}
                  </h2>
                </div>

                {/*Profile pic, name & stars*/}
                <img src="frontend/public/profilepic.png" alt="" />
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-0.5" style={{margin:8}}>
                  <img src="frontend/public/profilepic.png" alt="" />
                  <section>
                    <img src="/star (1).png"  alt='star'/>
                    <p className="mt-2 text-2s font-bold text-black">
                    {
                  }
                    </p>
                  </section>
                </div>

                {/* Description */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-8 text-left w-8/10">
                  <p className="mt-3 text-black" style={{ fontSize: "0.9rem" }}>
                  {/*tool.description*/"bra"}
                  </p>
                </div>
                
            </section>

            {/* Right side of page */}
            <section className='pl-10' style={{alignItems:'last-baseline'}}>

              <Calendar calendarSize={400} />



              {/* Submit */}
                <div className="flex justify-center">
                  <PrimaryButton type="submit" disabled={loading} size="md">
                    {loading ? 'Sending Request...' : 'Send Request'}
                  </PrimaryButton>
                </div>
            </section>
          </div>

          </div>
          </section>
    );
  }