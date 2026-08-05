"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const AMENITIES = [
    "Parking", "24/7 Power", "Water Heater", "Air Conditioning", "Furnished",
    "WiFi", "Security", "Swimming Pool", "Gym", "Balcony", "Elevator",
    "CCTV", "Borehole Water", "Gated Compound",
];

export type ListingFormValues = {
    title: string;
    description: string;
    price: string;
    priceType: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    address: string;
    city: string;
    state: string;
};

const DEFAULT_VALUES: ListingFormValues = {
    title: "",
    description: "",
    price: "",
    priceType: "per month",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    address: "",
    city: "",
    state: "",
};

export type ListingFormSubmission = {
    form: ListingFormValues;
    amenities: string[];
    existingImages: string[];
    newImageFiles: File[];
};

type Props = {
    initialValues?: Partial<ListingFormValues>;
    initialAmenities?: string[];
    initialImages?: string[];
    submitLabel: string;
    loadingLabel: string;
    onCancel: () => void;
    onSubmit: (data: ListingFormSubmission) => Promise<void>;
};

export default function ListingForm({
    initialValues,
    initialAmenities = [],
    initialImages = [],
    submitLabel,
    loadingLabel,
    onCancel,
    onSubmit,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialImages);
    const [amenities, setAmenities] = useState<string[]>(initialAmenities);
    const [form, setForm] = useState<ListingFormValues>({ ...DEFAULT_VALUES, ...initialValues });

    const previews = useMemo(() => imageFiles.map((file) => URL.createObjectURL(file)), [imageFiles]);

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const adjustCount = (field: "bedrooms" | "bathrooms", delta: number) =>
        setForm((f) => ({ ...f, [field]: Math.max(1, f[field] + delta) }));

    const toggleAmenity = (amenity: string) =>
        setAmenities((current) =>
            current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]
        );

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        setImageFiles((current) => [...current, ...Array.from(files)]);
    };

    const removeFile = (index: number) =>
        setImageFiles((current) => current.filter((_, i) => i !== index));

    const removeExistingImage = (url: string) =>
        setExistingImages((current) => current.filter((img) => img !== url));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ form, amenities, existingImages, newImageFiles: imageFiles });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Basic details
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="text-sm font-semibold">Title</label>
                        <input
                            id="title"
                            name="title"
                            placeholder="e.g. 3 Bed Duplex, Lekki Phase 1"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="description" className="text-sm font-semibold">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe the property, neighborhood, and what makes it stand out"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                        />
                    </div>
                </div>
            </section>

            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Pricing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price" className="text-sm font-semibold">Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="2,500,000"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="bg-background border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="priceType" className="text-sm font-semibold">Billing period</label>
                        <select
                            id="priceType"
                            name="priceType"
                            value={form.priceType}
                            onChange={handleChange}
                            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            <option>per month</option>
                            <option>per year</option>
                            <option>per night</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Property details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="propertyType" className="text-sm font-semibold">Property type</label>
                        <select
                            id="propertyType"
                            name="propertyType"
                            value={form.propertyType}
                            onChange={handleChange}
                            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="room">Room</option>
                            <option value="studio">Studio</option>
                            <option value="duplex">Duplex</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold">Bedrooms</span>
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button type="button" onClick={() => adjustCount("bedrooms", -1)} className="w-9 h-10 hover:bg-muted">−</button>
                            <span className="flex-1 text-center text-sm font-semibold">{form.bedrooms}</span>
                            <button type="button" onClick={() => adjustCount("bedrooms", 1)} className="w-9 h-10 hover:bg-muted">+</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold">Bathrooms</span>
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button type="button" onClick={() => adjustCount("bathrooms", -1)} className="w-9 h-10 hover:bg-muted">−</button>
                            <span className="flex-1 text-center text-sm font-semibold">{form.bathrooms}</span>
                            <button type="button" onClick={() => adjustCount("bathrooms", 1)} className="w-9 h-10 hover:bg-muted">+</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Location
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="address" className="text-sm font-semibold">Street address</label>
                        <input
                            id="address"
                            name="address"
                            placeholder="12 Admiralty Way"
                            value={form.address}
                            onChange={handleChange}
                            required
                            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="city" className="text-sm font-semibold">City</label>
                            <input
                                id="city"
                                name="city"
                                placeholder="Lekki"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="state" className="text-sm font-semibold">State</label>
                            <input
                                id="state"
                                name="state"
                                placeholder="Lagos"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {AMENITIES.map((amenity) => {
                        const selected = amenities.includes(amenity);
                        return (
                            <button
                                type="button"
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors ${
                                    selected
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary/50"
                                }`}
                            >
                                <span
                                    className={`h-4 w-4 rounded shrink-0 flex items-center justify-center text-[10px] ${
                                        selected ? "bg-primary text-primary-foreground" : "border border-border"
                                    }`}
                                >
                                    {selected ? "✓" : ""}
                                </span>
                                {amenity}
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="glass rounded-3xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Photos
                </h2>
                <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        addFiles(e.dataTransfer.files);
                    }}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl py-8 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
                >
                    <ImagePlus size={22} />
                    Click to upload, or drag and drop property photos
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => addFiles(e.target.files)}
                        className="hidden"
                    />
                </label>

                {(existingImages.length > 0 || previews.length > 0) && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                        {existingImages.map((url) => (
                            <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="Listing photo" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {previews.map((src, i) => (
                            <div key={src} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-border px-6 py-2.5 rounded-full text-sm font-medium hover:bg-muted transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {loading ? loadingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
}
