import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        priceType: {
            type: String,
            enum: ["per month", "per year", "per night"],
            default: "per month",
        },
        propertyType: {
            type: String,
            enum: ["apartment", "house", "room", "studio", "duplex", "office"],
            required: true,
        },
        bedrooms: {type: Number, required: true},
        bathrooms: {type: Number, required: true},
        location: {
            address: {type: Number, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            // For map pins [longitude, latitude]
            coordinates: {type: [Number], index: "2dsphere"}, // enables geo queries
        },
        images: [String], //array of Cloudinary URLs
        amenities: [String], // ["Wifi", "Generator", "Water", "Security"]
        isAvailable: { type: Boolean, default: true},
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // links to the User model
            required: true,
        }
    },
    {timestamps: true} // adds createdAt and updatedAt automatically
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;