"use client"
import {toast} from "react-hot-toast"

import {Listing} from "@/types/listing";
import {useCallback, useEffect, useState} from "react";
import {fetchListings} from "@/lib/listings";
import {Search} from "lucide-react";
import ListingCard from "@/components/ListingCard";
import {useRouter, useSearchParams} from "next/navigation";

export default function ListingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [propertyType, setPropertyType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const loadListings = useCallback(async (signal?: AbortSignal) => {
        const trimmedSearch = search.trim();
        const trimmedMaxPrice = maxPrice.trim();
        const parsedMaxPrice = Number(trimmedMaxPrice);

        setLoading(true);
        try {
            const data = await fetchListings({
                search: trimmedSearch || undefined,
                propertyType: propertyType || undefined,
                maxPrice: trimmedMaxPrice && Number.isFinite(parsedMaxPrice) ? parsedMaxPrice : undefined
            }, signal);
            setListings(data.listings);
        } catch (e) {
            if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") {
                return;
            }

            console.error("Error fetching all the listings", e);
            toast.error("Failed to load listings");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [search, propertyType, maxPrice])

    const clearFilters = () => {
        setSearch("");
        setPropertyType("");
        setMaxPrice("");
        router.replace("/listings", {scroll: false});
    }

    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            void loadListings(controller.signal);
        }, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [loadListings])

    return (
        <div className="min-h-screen">

            {/* Page Header */}
            <section className="bg-foreground pt-28 pb-12 px-14">
                <h2 className="uppercase font-other text-background text-xl md:text-2xl">Browse</h2>
                <h1 className="text-background text-4xl md:text-5xl font-bold leading-tight mt-1">
                    Find Your <span className="text-primary glow-text">Next Home</span>
                </h1>
                {!loading && (
                    <p className="text-muted-foreground font-other mt-3 text-sm">
                        {listings.length} {listings.length === 1 ? "property" : "properties"} available
                    </p>
                )}
            </section>

            {/* Sticky Filter Bar */}
            <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 md:px-14 py-4">
                <div className="flex flex-wrap gap-3 items-center max-w-5xl">

                    <div className="glass flex items-center gap-2 rounded-full px-4 py-2 flex-1 min-w-40">
                        <Search size={14} className="text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            placeholder="Search title, city, state, address"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
                        />
                    </div>

                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="glass rounded-full px-4 py-2 text-sm outline-none appearance-none cursor-pointer font-other"
                    >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="room">Room</option>
                        <option value="studio">Studio</option>
                        <option value="duplex">Duplex</option>
                    </select>

                    <div className="glass flex items-center gap-1 rounded-full px-4 py-2">
                        <span className="text-muted-foreground text-sm">₦</span>
                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="bg-transparent outline-none text-sm w-28 placeholder:text-muted-foreground"
                        />
                    </div>

                    <button
                        onClick={() => void loadListings()}
                        className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-other flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Search size={14} /> Search
                    </button>

                    <button
                        onClick={clearFilters}
                        className="text-primary font-other text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Results */}
            <section className="px-6 md:px-14 py-10 bg-background">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-video bg-muted" />
                                <div className="p-6 space-y-3 bg-background">
                                    <div className="h-5 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                    <div className="h-4 bg-muted rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-24 space-y-4">
                        <p className="text-5xl">🏚</p>
                        <h3 className="text-xl font-semibold">No listings found</h3>
                        <p className="text-muted-foreground font-other text-sm">Try adjusting your filters</p>
                        <button
                            onClick={clearFilters}
                            className="text-primary font-other text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="font-other text-muted-foreground text-sm mb-6">
                            Showing {listings.length} {listings.length === 1 ? "result" : "results"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {listings.map((listing) => (
                                <ListingCard listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </>
                )}
            </section>

        </div>
    );
}
