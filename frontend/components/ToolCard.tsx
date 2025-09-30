import * as React from 'react';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import AuthCard from '@/components/AuthCard';
import FormField from '@/components/FormField';


interface Tool {
  id: number;
  name: string;
  description: string;
  user: {
    username: string;
  };
}

type ToolCardProps = {
    size: number;
    //image: string;
    title: string;
    owner: string;
    place: string;
    price: number;
    description: string;
};



export default function ToolCard({size, title, owner, place, price, description}: ToolCardProps){
    const [loading, setLoading] = React.useState(false);  
  
  return(
      <section  style={{ maxWidth: 1000 }}>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 text-left">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6" style={{width:size}}>
            
            {/* Left side of page */}
            <section style={{width: size/1.5}}>
                {/* Image of tool*/}
                <img src="https://verktygsboden.se/pub_images/original/87907.jpg" width={size/1.5} height={size/3} alt="Placeholder pic of hammer"/>
              
                {/* Title, place and price under tool*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" style={{maxWidth:size/1.5}}>
                  <h2 className="text-2xl font-bold text-black">
                    {title}
                  </h2>
                  <h2  className="text-2xl font-bold text-black">
                  {price + " kr/dag"}
                  </h2>
                  <h2 className="text-2xl font-thin text-black">
                  {place}
                  </h2>
                </div>

                {/*Profile pic, name & stars*/}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6" style={{maxWidth:size/3, margin:8}}>
                  <img src="/profilepic.png"  width={size/10} alt="" />
                  <section>
                    <img src="/star (1).png" width={size/50} alt='star'/>
                    <p className="mt-2 text-2s font-bold text-black">
                    {owner}
                    </p>
                  </section>
                </div>

                {/* Description */}
                <div style={{maxWidth:size/1.5, maxHeight:size/3}} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-8 text-left">
                  <p className="mt-3 text-black" style={{ fontSize: "0.9rem" }}>
                  {description}
                  </p>
                </div>
                
            </section>

            {/* Right side of page */}
            <section className='ml-40' style={{alignItems:'last-baseline', width:size/1.5}}>
              <img src="/profilepic.png" width={size/3} alt=''/>

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