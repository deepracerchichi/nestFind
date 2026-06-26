"use client"

import {Bath, BedDouble, BookmarkIcon, Droplets, MapPin, Wifi, Zap} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Listing} from "@/types/listing";
import {fetchListing, toggleSaveListing} from "@/lib/listings";
import {toast} from "react-hot-toast";
import Image from "next/image";

const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Generator: Zap,
    Water: Droplets,
}

export default function ListingDetailPage() {
    const {id} = useParams();
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
        <div>
            {/* Image Gallery */}
            <div>
                <div>
                    
                    {/* <Image
                        src={listing.images[activeImage] || "/placeholder.jpg"}
                        alt={listing.title}
                        fill
                        className=""
                    /> */}
                </div>

                {listing.images.length > 1 && (
                    <div>
                        {listing.images.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImage(idx)}>
                                <div className={`relative h-16 w-24 rounded-md overflow-hidden border-2
                                ${activeImage === idx ? "border-blue-600" : "border-transparent"}
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
            <div>
                <div>
                    <div>
                        <h1>{listing.title}</h1>

                        <div>
                            <MapPin size={16} />
                            <span>{listing.location.address}, {listing.location.city}</span>

                        </div>
                    </div>

                    <button onClick={handleSave} >
                        <BookmarkIcon
                            size={24}
                            className={saved ? "fill-red-500 text-red-500" : "text-gray-400"}
                        />

                    </button>
                </div>

                <div>
                    &#8358; {listing.price.toLocaleString()}
                    <span>
                        /{listing.priceType.replace("per ", "")}
                    </span>
                </div>

                <div>
                    <span>
                        <BedDouble size={18} /> {listing.bedrooms} Bedrooms
                    </span>

                    <span>
                        <Bath size={18} /> {listing.bathrooms} Bathrooms
                    </span>
                </div>

                <div>
                    <h2>Description</h2>
                    <p>{listing.description}</p>
                </div>

                {listing.amenities.length > 0 && (
                    <div>
                       <h2>Amenities</h2>
                       <div>
                           {listing.amenities.map((a) => (
                               <span key={a}>
                                   {a}
                               </span>
                           ))}
                       </div>
                    </div>
                )}

                <div>
                    <p>
                        Posted by <span>{listing.postedBy.username}</span>
                    </p>

                    <button>Contact Landlord</button>
                </div>
            </div>
        </div>
    );
}