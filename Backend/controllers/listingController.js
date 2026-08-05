import Listing from "../models/listing.js";

export const getListings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        //Build a filter object from query params
        const filter = { isAvailable: true };
        const search = req.query.search || req.query.city || req.query.title;

        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { propertyType: searchRegex },
                { "location.address": searchRegex },
                { "location.city": searchRegex },
                { "location.state": searchRegex },
            ];
        }

        if (req.query.city)
            filter["location.city"] = { $regex: req.query.city, $options: "i"};
        if (req.query.propertyType)
            filter.propertyType = req.query.propertyType;
        // Prices only compare meaningfully within a single currency, so a
        // price filter is always scoped to whichever currency the client sends.
        if (req.query.currency)
            filter.currency = req.query.currency;
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
        }
        if (req.query.bedrooms) filter.bedrooms = parseInt(req.query.bedrooms);

        const total = await Listing.countDocuments(filter);
        const listings = await Listing.find(filter)
            .populate("postedBy", "username email") // grab posters name and email
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({listings, total, totalPages: Math.ceil(total / limit), currentPage: page});


    } catch (e) {
        console.error("Error getting savedlistings: ", e);
        res.status(500).json({message: "Server error"});
    }
}

//GET /api/savedlistings/:id get one listing by ID
export const getOneListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate("postedBy", "username email");
        if (!listing) return res.status(404).json({message: "Listing not found"});
        res.status(200).json(listing);
    } catch (e) {
        console.error("Error getting listing", e);
        res.status(500).json({message: "Server error"});

    }
}


//POST /api/savedlistings - create a listing (admin only).
export const createListing = async (req, res) => {
    try {
        const {title, description, price, currency, priceType, propertyType, bedrooms, bathrooms, location, amenities, images} = req.body;
        const listing = new Listing({
            title, description, price, currency, priceType, propertyType,
            bedrooms, bathrooms, location, amenities, images,
            postedBy: req.user.id, //comes from verifyToken middleware
        });
        await listing.save();
        res.status(200).json({message: "Listing Created Successfully!"});
    } catch (e) {
        console.error("Error creating listing", e);
        res.status(500).json({message: "Server error"});
    }
}

//PATCH /api/savedlistings/:id - update a listing

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({message: "Listing not found"});
        // Only the person who posted it can update it
        if (listing.postedBy.toString() !== req.user.id)
            return res.status(403).json({message: "Not authorized"});

        // Whitelist editable fields instead of trusting the whole body -
        // otherwise a raw API call could set postedBy or any other field.
        const {
            title, description, price, currency, priceType, propertyType,
            bedrooms, bathrooms, location, amenities, images, isAvailable,
        } = req.body;
        const updates = {
            title, description, price, currency, priceType, propertyType,
            bedrooms, bathrooms, location, amenities, images, isAvailable,
        };
        Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

        const updated = await Listing.findByIdAndUpdate(req.params.id, updates, {new: true}); //return the new updated doc not the old one
        res.status(200).json({message: "Listing updated ", listing: updated})
    } catch (e) {
        console.error("Error updating listing", e);
        res.status(500).json({message: "Server error"});
        
    }
}

// DELETE /api/savedlistings/:id
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({message: "Listing not found"});
        if (listing.postedBy.toString() !== req.user.id)
            return res.status(403).json({message: "Not authorized"});
        await listing.deleteOne();
        res.status(200).json({message: "Listing deleted successfully"});
    } catch (e) {
        console.error("Error deleting listing", e);
        res.status(500).json({message: "Server error"});
    }
}

//GET /api/savedlistings/mine
export const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({
            postedBy: req.user.id
        }).sort({createdAt: -1});
        res.status(200).json({listings, total: listings.length})
    } catch (e) {
        console.error("Error getting your savedlistings", e);
        res.status(500).json({message: "Server error"});
    }
}
