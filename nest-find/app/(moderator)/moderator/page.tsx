"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Clock, ListChecks } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchPendingVerifications, decideVerification } from "@/lib/listings";
import type { Listing } from "@/types/listing";
import ModeratorTabs from "@/components/ModeratorTabs";


export default function ModeratorQueuePage() {
    const { user } = useAuth();
    const [pending, setPending] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const listings = await fetchPendingVerifications(controller.signal);
                setPending(listings);
            } catch (e) {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error fetching pending verifications", e);
                toast.error("Failed to load pending verifications");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const handleDecision = async (listing: Listing, status: "verified" | "rejected") => {
        setBusyId(listing._id);
        try {
            await decideVerification(listing._id, status, notes[listing._id]);
            setPending((current) => current.filter((l) => l._id !== listing._id));
            toast.success(status === "verified" ? "Listing verified" : "Listing rejected");
        } catch (e) {
            console.error("Error deciding verification", e);
            toast.error("Couldn't submit decision, try again");
        } finally {
            setBusyId(null);
        }
    };

    // pending is sorted oldest-first by the backend, so [0] is the longest-waiting listing.
    const oldestWaitDays = pending.length
        ? Math.floor((Date.now() - new Date(pending[0].createdAt).getTime()) / 86_400_000)
        : null;
    const oldestWaitDisplay =
        oldestWaitDays === null ? "—" : oldestWaitDays === 0 ? "Today" : `${oldestWaitDays}d`;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-24 bg-background" />
            <div className="bg-foreground flex-1 px-6 md:px-14 pt-8 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <ModeratorTabs />
                    </div>

                    {/* Hero */}
                    <div className="bg-background rounded-3xl p-8 flex items-center gap-4 mb-6 animate-fade-in">
                        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground font-semibold text-xl flex items-center justify-center shrink-0">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="uppercase font-other text-xs tracking-wide text-muted-foreground mb-1">Moderator Dashboard</p>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                                Welcome back, <span className="text-primary glow-text">{user?.username}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <div className="bg-background rounded-2xl p-5">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                                <ListChecks size={14} /> Pending review
                            </p>
                            <p className="text-3xl font-other font-semibold">
                                {loading ? "—" : pending.length}
                            </p>
                        </div>
                        <div className="bg-background rounded-2xl p-5">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                                <Clock size={14} /> Oldest waiting
                            </p>
                            <p className="text-3xl font-other font-semibold">
                                {loading ? "—" : oldestWaitDisplay}
                            </p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-background mb-4">Queue</h2>


                    {loading ? (
                        <p className="text-muted-foreground text-sm">Loading...</p>
                    ) : pending.length === 0 ? (
                        <div className="text-center py-24 space-y-2">
                            <p className="text-5xl">✓</p>
                            <h3 className="text-xl font-semibold text-background">Queue is empty</h3>
                            <p className="text-muted-foreground text-sm">Nothing waiting on review right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {pending.map((listing) => (
                                <div key={listing._id} className="bg-background rounded-2xl p-5 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl text-foreground">{listing.title}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {listing.location.address}, {listing.location.city}, {listing.location.state}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Submitted by {listing.postedBy.username} ({listing.postedBy.email})
                                            </p>
                                        </div>
                                        {listing.verificationDocument && (
                                            <a
                                                href={listing.verificationDocument}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-xs underline underline-offset-4 shrink-0"
                                            >
                                                View document
                                            </a>
                                        )}
                                    </div>

                                    <textarea
                                        placeholder="Note (optional) - shown to the lister if rejected"
                                        value={notes[listing._id] ?? ""}
                                        onChange={(e) =>
                                            setNotes((current) => ({ ...current, [listing._id]: e.target.value }))
                                        }
                                        className="w-full text-sm rounded-lg glass text-foreground p-2.5"
                                        rows={2}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            disabled={busyId === listing._id}
                                            onClick={() => void handleDecision(listing, "verified")}
                                            className="flex-1 bg-primary text-primary-foreground rounded-full py-2 text-xs font-medium disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            disabled={busyId === listing._id}
                                            onClick={() => void handleDecision(listing, "rejected")}
                                            className="flex-1 border border-destructive/40 text-destructive rounded-full py-2 text-xs font-medium disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
