import {Listing} from "@/types/listing";
import Link from "next/link";
import Image from "next/image";
import {MapPin, BedDouble, Bath} from "lucide-react"


export default function ListingCard({listing}: {listing: Listing}) {
    const firstImage = listing.images[0] || "/placeholder.jpg";
    return (
        <Link href={`listings/${listing._id}`}>
            <div className='group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1'>

                <div className='relative overflow-hidden aspect-video'>
                    <Image
                        src={firstImage}
                        alt={listing.title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <span className="absolute top-3 right-3 glass text-xs font-other px-3 py-1 rounded-full">
                        /{listing.priceType.replace("per ", "")}
                    </span>
                </div>

                <div className='p-6 space-y-4 bg-background'>
                    <div className='flex items-start justify-between'>
                        <h3 className='text-xl font-semibold group-hover:text-primary line-clamp-1'>
                            {listing.title}
                        </h3>
                        <p className='text-xl font-other group-hover:text-primary shrink-0 ml-2'>
                            ₦{listing.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex justify-between items-center font-other">
                        <div className="flex gap-2">
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                                <BedDouble className="w-5 h-5" />
                                {listing.bedrooms} bed
                            </p>
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                                <Bath className="w-5 h-5" />
                                {listing.bathrooms} bath
                            </p>
                        </div>

                        <p className='text-muted-foreground text-sm flex items-center gap-1 truncate max-w-35'>
                            <MapPin className="w-5 h-5 shrink-0" />
                            {listing.location.city}, {listing.location.state}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
