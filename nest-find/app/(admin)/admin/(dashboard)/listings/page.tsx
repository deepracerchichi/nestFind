"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { fetchMyListings, updateListing, deleteListing } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/ListingCard";

export default function MyListingsPage() {
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

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

    const handleToggleAvailability = async (listing: Listing) => {
        setBusyId(listing._id);
        const nextAvailable = !listing.isAvailable;
        setMyListings((current) =>
            current.map((l) => (l._id === listing._id ? { ...l, isAvailable: nextAvailable } : l))
        );

        try {
            await updateListing(listing._id, { isAvailable: nextAvailable });
        } catch (e) {
            console.error("Error updating listing availability", e);
            toast.error("Couldn't update availability, try again");
            setMyListings((current) =>
                current.map((l) => (l._id === listing._id ? { ...l, isAvailable: listing.isAvailable } : l))
            );
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (listing: Listing) => {
        if (!window.confirm(`Delete "${listing.title}"? This can't be undone.`)) return;

        setBusyId(listing._id);
        const previous = myListings;
        setMyListings((current) => current.filter((l) => l._id !== listing._id));

        try {
            await deleteListing(listing._id);
            toast.success("Listing deleted");
        } catch (e) {
            console.error("Error deleting listing", e);
            toast.error("Couldn't delete listing, try again");
            setMyListings(previous);
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold mb-6">My listings</h1>

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
            ) : myListings.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                    <p className="text-5xl">⌂</p>
                    <h3 className="text-xl font-semibold">No listings yet</h3>
                    <p className="text-muted-foreground font-other text-sm">
                        Create your first listing to get it in front of buyers.
                    </p>
                    <Link
                        href="/admin/create-listing"
                        className="inline-block text-primary font-other text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Create a listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {myListings.map((listing) => (
                        <div key={listing._id}>
                            <div className="relative">
                                <span
                                    className={`absolute top-3 left-3 z-10 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                                        listing.isAvailable
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {listing.isAvailable ? "Available" : "Unavailable"}
                                </span>
                                <ListingCard listing={listing} />
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => toast("Edit form is coming soon")}
                                    className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-full py-2 text-xs font-medium hover:bg-muted transition-colors"
                                >
                                    <Pencil size={13} /> Edit
                                </button>
                                <button
                                    disabled={busyId === listing._id}
                                    onClick={() => void handleToggleAvailability(listing)}
                                    className="flex-1 border border-border rounded-full py-2 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    {listing.isAvailable ? "Mark unavailable" : "Mark available"}
                                </button>
                                <button
                                    disabled={busyId === listing._id}
                                    onClick={() => void handleDelete(listing)}
                                    className="flex-1 flex items-center justify-center gap-1.5 border border-destructive/40 text-destructive rounded-full py-2 text-xs font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
