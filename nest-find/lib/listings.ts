import api from "@/lib/api";
import type { Listing } from "@/types/listing";

export const fetchSavedListings = async (signal?: AbortSignal): Promise<Listing[]> => {
    const res = await api.get<{ listings: Listing[] }>("/api/users/saved", { signal });
    return res.data.listings;
}

export const fetchListings = async (params?:{
    search?: string;
    title?: string;
    city?: string;
    propertyType?: string;
    currency?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    page?: number;
}, signal?: AbortSignal)=> {
    const res = await api.get("/api/listings", {params, signal});
    return res.data;
}

export const fetchListing = async (id: string) => {
    const res = await api.get(`/api/listings/${id}`);
    return res.data;
}

export const toggleSaveListing = async (listingId: string) => {
    const res = await api.post(`/api/users/save/${listingId}`);
    return res.data;
}

export const fetchMyListings = async (signal?: AbortSignal): Promise<Listing[]> => {
    const res = await api.get<{ listings: Listing[]; total: number }>("/api/listings/me", { signal });
    return res.data.listings;
}

export const updateListing = async (id: string, data: Partial<Omit<Listing, "_id" | "postedBy" | "createdAt">>) => {
    const res = await api.patch(`/api/listings/${id}`, data);
    return res.data;
}

export const deleteListing = async (id: string) => {
    const res = await api.delete(`/api/listings/${id}`);
    return res.data;
}

export const submitReport = async (listingId: string, reason: string) => {
    const res = await api.post(`/api/listings/${listingId}/report`, { reason });
    return res.data;
}

export const fetchPendingVerifications = async (signal?: AbortSignal): Promise<Listing[]> => {
    const res = await api.get<{ listings: Listing[] }>("/api/listings/pending-verification", { signal });
    return res.data.listings;
}

export const decideVerification = async (listingId: string, status: "verified" | "rejected", note?: string) => {
    const res = await api.patch(`/api/listings/${listingId}/verify`, { status, note });
    return res.data;
}

