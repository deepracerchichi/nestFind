import api from "@/lib/api";

export const fetchListings = async (params?:{
    title?: string;
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    page?: number;
})=> {
    const res = await api.get("/api/listings", {params});
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