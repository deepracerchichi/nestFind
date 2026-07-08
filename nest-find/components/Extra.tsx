import { PlusIcon } from 'lucide-react'
import React from 'react'
import {useRouter} from "next/navigation";

const Extra = () => {
    const router = useRouter();
    const handleRegister = () => {
        router.push("/register");
    }
  return (
    <section className='bg-foreground flex justify-center items-center mx-auto text-center p-20'>
        <div className='bg-primary px-28  grid md:grid-cols-1 lg:grid-cols-2 rounded-2xl py-18 gap-1  justify-between'>

            <div className='flex-col '>
                <div className='text-white text-4xl text-left'>
                    List your Property for Free Today
                </div>
                <div className="mt-3 ">
                    <p className="text-white text-left font-other text-xl">
                        Reach thousands of qualified buyers and renters. 
                        Create a listing in minutes, manage inquiries, and close faster.
                    </p>
                </div>
            </div>

            <div className='flex-col'>
                <button 
                    className=' bg-background rounded-full px-6 py-0 h-12 text-foreground text-lg gap-2 hover:bg-foreground hover:text-background transition-all duration-300'
                    onClick={handleRegister}>
                    <span className="flex items-center gap-2">
                        Get Started as Owner
                        <PlusIcon />
                    </span>
                    
                </button>
                <p className="text-background text-center font-other text-md mt-2">
                    No credit card required. 
                </p>
            </div>
        </div>
    </section>
  )
}

export default Extra