
export type Listing = {
    _id: string;
    title: string;
    description: string;
    price: number;
    priceType: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    location: {
        address: string;
        city: string;
        state: string;
        coordinates?:[number, number];
    };
    images: string[];
    amenities: string[];
    isAvailable: boolean;
    postedBy: {
        username: string;
        email: string;
    };
    createdAt: string;
};