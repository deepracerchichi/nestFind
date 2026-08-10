"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { fetchReports, resolveReport } from "@/lib/reports";
import ModeratorTabs from "@/components/ModeratorTabs";
import type { Report } from "@/types/report";

export default function ModeratorReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetchReports(controller.signal)
            .then(setReports)
            .catch((e) => {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error fetching reports", e);
                toast.error("Failed to load reports");
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const handleResolve = async (report: Report, status: "resolved" | "dismissed") => {
        setBusyId(report._id);
        try {
            await resolveReport(report._id, status);
            setReports((current) => current.filter((r) => r._id !== report._id));
            toast.success(status === "resolved" ? "Report resolved" : "Report dismissed");
        } catch (e) {
            console.error("Error updating report", e);
            toast.error("Couldn't update report, try again");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-24 bg-background" />
            <div className="bg-foreground flex-1 px-6 md:px-14 pt-8 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <ModeratorTabs />
                    </div>

                    <h2 className="text-lg font-semibold text-background mb-4">Open reports</h2>

                    {loading ? (
                        <p className="text-muted-foreground text-sm">Loading...</p>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-24 space-y-2">
                            <p className="text-5xl">✓</p>
                            <h3 className="text-xl font-semibold text-background">No open reports</h3>
                            <p className="text-muted-foreground text-sm">Nothing flagged right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {reports.map((report) => (
                                <div key={report._id} className="bg-background rounded-2xl p-5 space-y-3">
                                    <div>
                                        <Link href={`/listings/${report.listing._id}`} target="_blank" className="font-semibold hover:text-primary">
                                            {report.listing.title}
                                        </Link>
                                        <p className="text-sm mt-1">{report.reason}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Reported by {report.reportedBy.username} ({report.reportedBy.email})
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={busyId === report._id}
                                            onClick={() => void handleResolve(report, "resolved")}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-full py-2 text-xs font-medium disabled:opacity-50"
                                        >
                                            <CheckCircle size={13} /> Resolve
                                        </button>
                                        <button
                                            disabled={busyId === report._id}
                                            onClick={() => void handleResolve(report, "dismissed")}
                                            className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-full py-2 text-xs font-medium disabled:opacity-50"
                                        >
                                            <XCircle size={13} /> Dismiss
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
