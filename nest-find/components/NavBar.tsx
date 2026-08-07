"use client"
import {useEffect, useRef, useState} from "react";
import {LayoutDashboard, LogOut, MapPin, MenuIcon, XIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {useAuth} from "@/context/AuthContext";

const dashboardHref = (role: string) =>
    role === "admin" ? "/admin" : role === "moderator" ? "/moderator" : "/dashboard";

export const NavBar= () => {
    // const headerRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {user, logout} = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogin = () => {
        router.push("/login");
    }

    const handleRegister = () => {
        router.push("/register")
    }

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await logout();
        router.push("/");
    }

   
    return (
        <header className={`fixed top-0 left-0 transition-colors right-0 z-50 duration-300 ${isScrolled ? "glass" : "bg-transparent"}`}>
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

                <div className="hidden md:flex md:items-center md:gap-4">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen((open) => !open)}
                                className="h-9 w-9 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-2 z-50">
                                    <div className="px-3 py-2 border-b border-border mb-1">
                                        <p className="text-sm font-medium truncate">{user.username}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>

                                    <Link
                                        href={dashboardHref(user.role)}
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-foreground hover:text-background transition-colors"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-foreground hover:text-background transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="hover:text-primary transition-colors duration-300"
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
                        </>
                    )}
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

                        {user ? (
                            <>
                                <Link
                                    href={dashboardHref(user.role)}
                                    onClick={()=> setIsMobile(false)}
                                    className="text-lg text-background hover:text-background py-2"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { setIsMobile(false); void handleLogout(); }}
                                    className="text-lg text-left text-background hover:text-background py-2"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}