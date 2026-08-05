"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { fetchListing, updateListing } from "@/lib/listings";
import ListingForm, { type ListingFormSubmission } from "@/components/ListingForm";
import type { Listing } from "@/types/listing";

export default function EditListingPage() {
    const router = useRouter();
    const { id } = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchListing(id as string)
            .then(setListing)
            .catch((e) => {
                console.error("Error loading listing", e);
                toast.error("Couldn't load this listing");
                router.push("/admin/listings");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleSubmit = async ({ form, amenities, existingImages, newImageFiles }: ListingFormSubmission) => {
        try {
            let newUrls: string[] = [];
            if (newImageFiles.length > 0) {
                const formData = new FormData();
                newImageFiles.forEach((file) => formData.append("images", file));

                const uploadRes = await api.post("/api/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                newUrls = uploadRes.data.urls;
            }

            await updateListing(id as string, {
                ...form,
                price: parseInt(form.price),
                images: [...existingImages, ...newUrls],
                amenities,
                location: { address: form.address, city: form.city, state: form.state },
            });

            toast.success("Listing updated");
            router.push("/admin/listings");
        } catch (e) {
            console.error("Error updating listing", e);
            toast.error("Failed to update listing, try again");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="h-24 bg-background" />
                <div className="bg-foreground flex-1 px-6 flex items-center justify-center text-muted-foreground text-sm">
                    Loading listing...
                </div>
            </div>
        );
    }

    if (!listing) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-24 bg-background" />
            <div className="bg-foreground flex-1 px-6 md:px-14 pt-8 pb-24">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/admin/listings"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-background mb-5"
                    >
                        <ArrowLeft size={15} /> Back to My Listings
                    </Link>

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-background">Edit listing</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Changes go live on Browse Listings immediately.
                        </p>
                    </div>

                    <ListingForm
                        initialValues={{
                            title: listing.title,
                            description: listing.description,
                            price: String(listing.price),
                            currency: listing.currency,
                            priceType: listing.priceType,
                            propertyType: listing.propertyType,
                            bedrooms: listing.bedrooms,
                            bathrooms: listing.bathrooms,
                            address: listing.location.address,
                            city: listing.location.city,
                            state: listing.location.state,
                        }}
                        initialAmenities={listing.amenities}
                        initialImages={listing.images}
                        submitLabel="Save changes"
                        loadingLabel="Saving..."
                        onCancel={() => router.push("/admin/listings")}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
