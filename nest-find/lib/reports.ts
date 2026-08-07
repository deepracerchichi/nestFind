import api from "@/lib/api";
import type { Report } from "@/types/report";

export const fetchReports = async (signal?: AbortSignal): Promise<Report[]> => {
    const res = await api.get<{ reports: Report[] }>("/api/reports", { signal });
    return res.data.reports;
}

export const resolveReport = async (reportId: string, status: "resolved" | "dismissed") => {
    const res = await api.patch(`/api/reports/${reportId}`, { status });
    return res.data;
}
