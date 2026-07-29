"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Heart } from "lucide-react";
import { fetchSavedListings, toggleSaveListing } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/ListingCard";

export default function SavedListingsPage() {
    const [savedListings, setSavedListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const listings = await fetchSavedListings(controller.signal);
                setSavedListings(listings);
            } catch (e) {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error fetching saved listings", e);
                toast.error("Failed to load your saved listings");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const handleUnsave = async (listingId: string) => {
        const previous = savedListings;
        setSavedListings((current) => current.filter((l) => l._id !== listingId));

        try {
            await toggleSaveListing(listingId);
        } catch (e) {
            console.error("Error unsaving listing", e);
            toast.error("Couldn't remove listing, try again");
            setSavedListings(previous);
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold mb-6">Saved listings</h1>

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
            ) : savedListings.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                    <p className="text-5xl">♡</p>
                    <h3 className="text-xl font-semibold">No saved listings yet</h3>
                    <p className="text-muted-foreground font-other text-sm">
                        Tap the heart icon on any listing to save it here for later.
                    </p>
                    <Link
                        href="/listings"
                        className="inline-block text-primary font-other text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Browse listings
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {savedListings.map((listing) => (
                        <div className="relative" key={listing._id}>
                            <button
                                onClick={() => void handleUnsave(listing._id)}
                                aria-label="Remove from saved listings"
                                className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full glass-strong flex items-center justify-center text-primary hover:scale-110 transition-transform"
                            >
                                <Heart size={15} fill="currentColor" />
                            </button>
                            <ListingCard listing={listing} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
