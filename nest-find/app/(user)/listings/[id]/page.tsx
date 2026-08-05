"use client"

import {Bath, BedDouble, BookmarkIcon, ChevronRight, Droplets, MapPin, Shield, Wifi, Zap} from "lucide-react";
import {useParams, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Listing} from "@/types/listing";
import {fetchListing, toggleSaveListing} from "@/lib/listings";
import {formatPrice} from "@/lib/currency";
import {toast} from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const amenityIcons: Record<string, any> = {
    Wifi: Wifi,
    Generator: Zap,
    Water: Droplets,
    Security: Shield,
}

export default function ListingDetailPage() {
    const {id} = useParams();
    const searchParams = useSearchParams();
    const fromParam = searchParams.get("from");
    const cameFromListings = !!fromParam && fromParam.startsWith("/listings");
    const [listing, setListing] = useState<Listing | null>(null)
    const [saved, setSaved] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(
        ()=> {
            if(id) fetchListing(id as string).then(setListing);
        },
        [id]
    );

    const handleSave = async () => {
        if (!listing) return;

        try {
            const res = await toggleSaveListing(listing._id);
            setSaved(res.saved);
        } catch (e) {
            console.error(e);

        }
    };

    if (!listing) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-14 pt-15 pb-16">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-other mb-6">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                </Link>
                {cameFromListings && (
                    <>
                        <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                        <Link href={fromParam as string} className="text-muted-foreground hover:text-primary transition-colors">
                            Listings
                        </Link>
                    </>
                )}
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium truncate max-w-60" aria-current="page">
                    {listing.title}
                </span>
            </nav>
            <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Gallery */}
            <div className="lg:w-2/3">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                    
                    <Image
                        src={listing.images[activeImage] || "/placeholder.jpg"}
                        alt={listing.title}
                        fill
                        className=""
                    />
                </div>

                {listing.images.length > 1 && (
                    <div className="flex gap-3 mt-4">
                        {listing.images.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImage(idx)}>
                                <div className={`relative h-16 w-24 rounded-md overflow-hidden border-2
                                ${activeImage === idx ? "border-primary" : "border-transparent"}
                                `}>
                                    <Image
                                        src={img}
                                        fill
                                        alt=""
                                        className="object-cover"
                                        />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="lg:w-1/3 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{listing.title}</h1>

                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground font-other">
                            <MapPin size={16} className="shrink-0" />
                            <span>{listing.location.address}, {listing.location.city}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="glass shrink-0 h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                    >
                        <BookmarkIcon
                            size={20}
                            className={saved ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                        />
                    </button>
                </div>

                {/* Price + facts + contact */}
                <div className="bg-foreground rounded-2xl p-6 space-y-5 sticky top-24">
                    <p className="text-3xl text-background font-bold">
                        {formatPrice(listing.price, listing.currency)}
                        <span className="text-sm font-other font-normal text-background">
                            /{listing.priceType.replace("per ", "")}
                        </span>
                    </p>

                    <div className="flex items-center gap-4 font-other border-y border-border py-4">
                        <span className="flex items-center gap-1.5 text-sm text-background">
                            <BedDouble size={18} className="text-primary" /> {listing.bedrooms} Bedrooms
                        </span>

                        <span className="flex items-center gap-1.5 text-sm text-background">
                            <Bath size={18} className="text-primary" /> {listing.bathrooms} Bathrooms
                        </span>
                    </div>

                    <button className="w-full bg-primary text-primary-foreground rounded-full py-3 font-other hover:opacity-90 transition-opacity">
                        Contact Landlord
                    </button>

                    <p className="text-xs text-center text-muted-foreground font-other">
                        Posted by <span className="text-primary font-medium">{listing.postedBy.username}</span>
                    </p>
                </div>

                <div>
                    <h2 className="uppercase font-other text-sm text-muted-foreground mb-2">Description</h2>
                    <p className="text-sm leading-relaxed text-foreground/80">{listing.description}</p>
                </div>

                {listing.amenities.length > 0 && (
                    <div>
                       <h2 className="uppercase font-other text-sm text-muted-foreground mb-2">Amenities</h2>
                       <div className="flex flex-wrap gap-2">
                           {listing.amenities.map((a) => {
                               const Icon = amenityIcons[a];
                               return (
                                   <span
                                       key={a}
                                       className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-other text-muted-foreground"
                                   >
                                       {Icon && <Icon size={14} className="text-primary" />}
                                       {a}
                                   </span>
                               );
                           })}
                       </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}