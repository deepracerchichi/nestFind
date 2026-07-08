import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='flex bg-background'>
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 py-10 px-6 md:px-20 w-full max-w-7xl">

            <div className="">
                <Link href="/" className="flex shrink-0">
                    <Image src="/navLogo.png" alt="logo" width={80} height={32} className="h-12 w-auto"/>
                </Link>

            </div>

            <div className="">

                <p className="">
                    2026 All Rights Reserved. © nestFind
                </p>
            </div>

            <div className="">
                <div className=" flex-col flex">
                    <Link href="/listings" className="text-lg text-muted-foreground hover:text-foreground py-2">
                        Listings
                    </Link>

                    <Link href="/login" className="text-lg text-muted-foreground hover:text-foreground py-2">
                        Login
                    </Link>

                    <Link href="/register" className="text-lg text-muted-foreground hover:text-foreground py-2">
                        Sign Up
                    </Link>
                </div>

            </div>
        </section>
        
    </footer>
  )
}

export default Footer