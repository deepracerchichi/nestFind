import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        currency: {
            type: String,
            enum: ["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR"],
            default: "NGN",
        },
        verificationStatus: {
            type: String,
            enum: ["unverified", "pending", "verified", "rejected"],
            default: "unverified",
        },
        verificationDocument:{type: String}, // Cloudinary URL of the uploaded proof-of-ownership doc
        verificationNote: {type: String}, // moderator's reason, shown to the seller mainly on rejection
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
            address: {type: String, required: true},
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