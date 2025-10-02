import * as React from 'react';
import PrimaryButton from '@/components/PrimaryButton';

import {displayTool } from "../services/toolService";

import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import { useYourTools } from "../hooks/tools";
import Calendar from '@/components/Calendar';



export default function TooldetailsPage(){
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const { query, setQuery, tools, loading, error, retry } = useYourTools();
    const router = useRouter();  
    const tool = displayTool(tools[0].id, tools[0].description)

    /* from other site*/
     // Redirect to login if not authenticated
      React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
          router.push('/');
          return;
        }
      }, [isAuthenticated, authLoading, router]);
    
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
      /* end from other site*/
  
  return(
      <section  style={{ alignContent:'center'}}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-0.8">
            
            {/* Left side of page */}
            <section className='w-0.4'>
                {/* Image of tool*/}
                <img src="https://verktygsboden.se/pub_images/original/87907.jpg" className='w-0.2 h-0.1' alt="Placeholder pic of hammer"/>
              
                {/* Title, place and price under tool*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-0.1" >
                  <h2 className="text-2xl font-bold text-black">
                    {tools[0].name}
                  </h2>
                  <h2  className="text-2xl font-bold text-black">
                  {tools[0].price + " kr/dag"}
                  </h2>
                  <h2 className="text-2xl font-thin text-black">
                  {"place"}
                  </h2>
                </div>

                {/*Profile pic, name & stars*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-0.5" style={{margin:8}}>
                  <img src="/profilepic.png w-0.01" alt="" />
                  <section>
                    <img src="/star (1).png w-0.05"  alt='star'/>
                    <p className="mt-2 text-2s font-bold text-black">
                    {
                  }
                    </p>
                  </section>
                </div>

                {/* Description */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-8 text-left w-0.1">
                  <p className="mt-3 text-black" style={{ fontSize: "0.9rem" }}>
                  {tools[0].description}
                  </p>
                </div>
                
            </section>

            {/* Right side of page */}
            <section className='ml-40 content-right w-0.6' style={{alignItems:'last-baseline'}}>

              <Calendar calendarSize={500} />
              


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