"use client"

import {NavBar} from "@/components/NavBar";
import {Globe} from "@/components/ui/globe";
import {Search} from "lucide-react";
import FeaturedListings from "@/components/FeaturedListings";
import AboutUs from "@/components/AboutUs";
import Extra from "@/components/Extra";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Footer from "@/components/Footer";

export default function Home() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedSearch = search.trim();
        if (!trimmedSearch) {
            router.push("/listings");
            return;
        }

        router.push(`/listings?search=${encodeURIComponent(trimmedSearch)}`);
    }

  return (
      <div className="min-h-screen overflow-x-hidden">
          {/*<Toaster />*/}
          <NavBar />
          <main>
              
              <header className="home-hero-pattern relative min-h-screen flex items-start pt-28 overflow-hidden">

                  <div className="container mx-auto px-6 pb-20 relative text-center">
                      <div className="relative z-10 items-center space-y-5">

                          {/* Headline */}
                          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                              Stop Scrolling. Start <span className="text-primary glow-text">Moving.</span>
                          </h1>

                          <p className="text-lg w-10/12 mx-auto">
                              Find verified apartments, houses, and studios across your vicinity all in one place.
                          </p>

                          <form
                              onSubmit={handleSearch}
                              className="glass rounded-full px-7 py-3 max-w-xl mx-auto flex items-center gap-3 justify-end"
                          >
                              <input
                                  className="w-full outline-none "
                                  placeholder="Search city, neighborhood, address"
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                              />
                              <button type="submit" aria-label="Search listings">
                                  <Search size={20} className="text-foreground"/>
                              </button>
                          </form>

                      </div>

                      <div className="relative h-80 sm:h-120 md:h-150 -mt-10">
                          <Globe className="top-0" />
                      </div>

                  </div>


             </header>

              <FeaturedListings />

              <AboutUs />

              <Extra />

              <Footer />

              

              


          </main>
      </div>

  );
}
