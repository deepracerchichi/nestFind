"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import ListingForm, { type ListingFormSubmission } from "@/components/ListingForm";

export default function CreateListingPage() {
    const router = useRouter();

    const handleSubmit = async ({ form, amenities, newImageFiles }: ListingFormSubmission) => {
        try {
            let imageUrls: string[] = [];
            if (newImageFiles.length > 0) {
                const formData = new FormData();
                newImageFiles.forEach((file) => formData.append("images", file));

                const uploadRes = await api.post("/api/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrls = uploadRes.data.urls;
            }

            await api.post("/api/listings", {
                ...form,
                price: parseInt(form.price),
                images: imageUrls,
                amenities,
                location: { address: form.address, city: form.city, state: form.state },
            });

            toast.success("Listing created");
            router.push("/admin/listings");
        } catch (e) {
            console.error("Error creating listing", e);
            toast.error("Failed to create listing, try again");
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-14 pb-24">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/admin/listings"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"
                >
                    <ArrowLeft size={15} /> Back to My Listings
                </Link>

                <div className="mb-7">
                    <h1 className="text-2xl font-bold">Create a new listing</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        This goes live on Browse Listings as soon as you publish it.
                    </p>
                </div>

                <ListingForm
                    submitLabel="Create listing"
                    loadingLabel="Creating..."
                    onCancel={() => router.push("/admin/listings")}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
