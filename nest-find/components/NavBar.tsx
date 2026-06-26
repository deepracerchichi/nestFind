"use client"
import {useState} from "react";
import {MapPin, MenuIcon, XIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const NavBar= () => {
    // const headerRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const handleLogin = () => {
        router.push("/login");
    }

    const handleRegister = () => {
        router.push("/register")
    }

    //
    // useGSAP(
    //     () => {
    //         const navTween = gsap.timeline({
    //             scrollTrigger: {
    //                 trigger: headerRef.current,
    //                 start: "bottom top"
    //             }
    //         })
    //
    //         navTween.fromTo(headerRef.current,
    //             {
    //                 backgroundColor: 'transparent',
    //                 paddingTop: '20px',
    //                 paddingBottom: '20px',
    //             },
    //             {
    //                 paddingTop: '12px',
    //                 paddingBottom: '12px',
    //                 backgroundColor: 'rgba(62, 34, 73, 0.9)',
    //                 backdropFilter: 'blur(16px)',
    //
    //                 duration: 1,
    //                 ease: 'power1.inOut'
    //             })
    //     }, { scope: headerRef }
    // )
    return (
        <header className="fixed top-0 left-0 transition-all right-0 z-50">
            <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
                <Link href="/" className="flex shrink-0">
                    <Image src="/navLogo.png" alt="logo" width={80} height={32} className="h-8 w-auto"/>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/listings" className="glass rounded-full px-9 py-2 flex items-center hover:-translate-y-1 transition-transform gap-1 hover:text-background hover:bg-foreground duration-400">
                        <MapPin size={14}/>
                        Browse Listings
                    </Link>

                    {/* <a href="/listings" className="">
                        Listings
                    </a> */}
                </div>

                <div className="hidden md:block md:space-x-4 lg:flex lg:items-center lg:gap-4">
                    <button
                        className=""
                        onClick={handleLogin}
                    >
                        Sign in
                    </button>
                    <button className=" px-4 py-2 rounded-full bg-foreground
                     text-background hover:text-primary hover:-translate-y-1
                     transition-transform duration-300"
                            onClick={handleRegister}
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu*/}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={()=>setIsMobile(!isMobile) }
                >
                    {isMobile ? <XIcon size={26} /> : <MenuIcon size={26} /> }

                </button>

            </nav>

            {/* Mobile Menu*/}
            {isMobile && (
                <div className="md:hidden bg-foreground ">
                    <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                        <Link
                            href="/listings"
                            onClick={()=> setIsMobile(false)}
                            className="text-lg text-muted-foreground hover:text-background py-2"
                        >
                            Browse Listings
                        </Link>

                        <Link
                            href="/login"
                            onClick={()=> setIsMobile(false)}
                            className="text-lg text-background hover:text-background py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            onClick={()=> setIsMobile(false)}
                            className="text-lg text-background hover:text-background py-2"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}