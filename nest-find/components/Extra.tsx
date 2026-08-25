import { PlusIcon } from 'lucide-react'
import React, { useRef } from 'react'
import {useRouter} from "next/navigation";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const Extra = () => {
    gsap.registerPlugin(ScrollTrigger);

    const containerRef = useRef<HTMLElement>(null);

    useGSAP(()=>{
        gsap.from(".fade-in-text", {
            opacity: 0,
            y: 20,
            stagger: 0.18,
            duration: 0.15,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",

            }
        })
    }, {scope:containerRef})

    const router = useRouter();
    const handleRegister = () => {
        router.push("/register");
    }
  return (
    <section ref={containerRef} className='bg-foreground flex justify-center items-center mx-auto text-center p-20'>
        <div className='fade-in-text bg-primary px-6 sm:px-12 md:px-28 grid md:grid-cols-1 lg:grid-cols-2 rounded-2xl py-18 gap-1 justify-between'>

            <div className='flex-col justify-center items-center'>
                <div className='fade-in-text text-white text-4xl text-left'>
                    List your Property for Free Today
                </div>
                <div className="mt-3 ">
                    <p className="fade-in-text text-white text-left font-other text-xl">
                        Reach thousands of qualified buyers and renters. 
                        Create a listing in minutes, manage inquiries, and close faster.
                    </p>
                </div>
            </div>

            <div className='fade-in-text flex-col'>
                <button
                    className=" bg-background rounded-full px-6 py-3 text-foreground text-base md:text-lg hover:bg-foreground hover:text-background transition-all duration-300"
                    onClick={handleRegister}>
                    <span className="flex items-center justify-center gap-2">
                        Get Started as an Owner
                        <PlusIcon />
                    </span>
                </button>
                <p className=" text-background text-center font-other text-md mt-2">
                    No credit card required. 
                </p>
            </div>
        </div>
    </section>
  )
}

export default Extra