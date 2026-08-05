"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Home, CircleDot, TrendingUp, PlusCircleIcon, PlusIcon, HouseIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyListings } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/ListingCard";

export default function AdminOverviewPage() {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const listings = await fetchMyListings(controller.signal);
                setMyListings(listings);
            } catch (e) {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error fetching your listings", e);
                toast.error("Failed to load your listings");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const availableCount = myListings.filter((l) => l.isAvailable).length;
    const avgPrice = myListings.length
        ? Math.round(myListings.reduce((sum, l) => sum + l.price, 0) / myListings.length)
        : null;

    return (
        <div>
            {/* Hero */}
            <div className="bg-background rounded-3xl p-8 flex items-center justify-between gap-6 flex-wrap mb-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground font-semibold text-xl flex items-center justify-center shrink-0">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="uppercase font-other text-xs tracking-wide text-muted-foreground mb-1">Realtor Dashboard</p>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                            Welcome back, <span className="text-primary glow-text">{user?.username}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
                    </div>
                </div>
                <Link
                    href="/admin/create-listing"
                    className="bg-foreground text-background px-6 py-3 rounded-full text-md font-medium hover:-translate-y-1 transition-transform"
                >
                     Create a new listing
                     <PlusIcon className="ml-2 h-5 w-5 inline-block" />
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-background rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                        <Home size={14} /> Total listings
                    </p>
                    <p className="text-3xl font-other font-semibold">
                        {loading ? "—" : myListings.length}
                    </p>
                </div>
                <div className="bg-background rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                        <CircleDot size={14} /> Available now
                    </p>
                    <p className="text-3xl font-other font-semibold">
                        {loading ? "—" : availableCount}
                    </p>
                </div>
                <div className="bg-background rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                        <TrendingUp size={14} /> Avg. asking price
                    </p>
                    <p className="text-3xl font-other font-semibold">
                        {loading ? "—" : avgPrice !== null ? `₦${avgPrice.toLocaleString()}` : "—"}
                    </p>
                </div>
            </div>

            {/* Recently added */}
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-background">Recently added</h2>
                {myListings.length > 0 && (
                    <Link href="/admin/listings" className="text-primary text-sm font-medium hover:opacity-80">
                        View all →
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-video bg-muted" />
                            <div className="p-6 space-y-3 bg-background">
                                <div className="h-5 bg-muted rounded w-3/4" />
                                <div className="h-4 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : myListings.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-background rounded-2xl">
                    <p className="text-4xl "><HouseIcon className="inline-block" /></p>
                    <h3 className="font-semibold">No listings yet</h3>
                    <p className="text-muted-foreground text-sm">Create your first listing to get it in front of buyers.</p>
                    <Link href="/admin/create-listing" className="inline-block text-primary text-sm font-medium underline underline-offset-4">
                        Create a listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {myListings.slice(0, 3).map((listing) => (
                        <ListingCard listing={listing} key={listing._id} />
                    ))}
                </div>
            )}
        </div>
    );
}
