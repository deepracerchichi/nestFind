"use client"
import {useEffect, useState} from "react";
import {Listing} from "@/types/listing";
import {fetchListings} from "@/lib/listings";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";

export default function FeaturedListings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings({page: 1})
            .then(data => setListings(data.listings.slice(0, 6)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-10 overflow-hidden bg-foreground px-14 space-y-7">
            <div className="flex items-end justify-between">
                <div className="space-y-5">
                    <h2 className="uppercase font-other text-background text-xl md:text-2xl">
                        Latest Properties
                    </h2>
                    <h1 className="text-background text-4xl md:text-5xl font-bold leading-tight">
                        Featured <span className="text-primary glow-text">Listings</span>
                    </h1>
                </div>

                
            </div>

            <div className="container mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {[...Array(3)].map((_, i) => (
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
                    <p className="text-muted-foreground font-other text-sm">No listings available yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {listings.map((listing) => (
                            <ListingCard listing={listing} key={listing._id} />
                        ))}
                    </div>
                    
                )}
            </div>
            <div className="flex justify-center">
                <Link
                href="/listings"
                className="inline-flex items-center mx-auto gap-1 text-foreground font-calsans  hover:text-primary hover:-translate-y-1 duration-500 mb-2 px-19 text-md bg-background py-3 rounded-full"
            >
                View all
            </Link>
            </div>
            
            
        </section>
    );
}
