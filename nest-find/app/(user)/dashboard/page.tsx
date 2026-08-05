"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Heart, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchSavedListings } from "@/lib/listings";
import { formatPrice } from "@/lib/currency";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/ListingCard";

export default function DashboardOverviewPage() {
    const { user } = useAuth();
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

    const savedCurrencies = new Set(savedListings.map((l) => l.currency));
    const avgPrice = savedListings.length
        ? Math.round(savedListings.reduce((sum, l) => sum + l.price, 0) / savedListings.length)
        : null;
    // Averaging across currencies would be a meaningless number - only show
    // one when every saved listing actually shares the same currency.
    const avgPriceDisplay =
        avgPrice === null ? "—" : savedCurrencies.size > 1 ? "Mixed" : formatPrice(avgPrice, savedListings[0].currency);

    return (
        <div>
            {/* Hero */}
            <div className="bg-background rounded-3xl p-8 flex items-center justify-between gap-6 flex-wrap mb-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground font-semibold text-xl flex items-center justify-center shrink-0">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="uppercase font-other text-xs tracking-wide text-muted-foreground mb-1">Your Dashboard</p>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                            Welcome back, <span className="text-primary glow-text">{user?.username}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
                    </div>
                </div>
                <Link
                    href="/listings"
                    className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:-translate-y-1 transition-transform"
                >
                    Browse listings
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="bg-background rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                        <Heart size={14} /> Saved listings
                    </p>
                    <p className="text-3xl font-other font-semibold">
                        {loading ? "—" : savedListings.length}
                    </p>
                </div>
                <div className="bg-background rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                        <TrendingUp size={14} /> Avg. saved price
                    </p>
                    <p className="text-3xl font-other font-semibold">
                        {loading ? "—" : avgPriceDisplay}
                    </p>
                </div>
            </div>

            {/* Recently saved */}
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-background">Recently saved</h2>
                {savedListings.length > 0 && (
                    <Link href="/dashboard/savedlistings" className="text-primary text-sm font-medium hover:opacity-80">
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
            ) : savedListings.length === 0 ? (
                <div className="text-center py-16 space-y-3 glass rounded-2xl">
                    <p className="text-4xl">♡</p>
                    <h3 className="font-semibold">No saved listings yet</h3>
                    <p className="text-muted-foreground text-sm">Tap the heart on any listing to save it here.</p>
                    <Link href="/listings" className="inline-block text-primary text-sm font-medium underline underline-offset-4">
                        Browse listings
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {savedListings.slice(0, 3).map((listing) => (
                        <ListingCard listing={listing} key={listing._id} />
                    ))}
                </div>
            )}
        </div>
    );
}
