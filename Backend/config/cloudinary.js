import dotenv from "dotenv";
import cloudinary from "cloudinary" // the whole module, not just .v2 - multer-storage-cloudinary's internals expect cloudinary.v2.uploader to exist on whatever's passed in
import CloudinaryStorage from "multer-storage-cloudinary"
import multer from "multer"
dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = CloudinaryStorage({
    cloudinary,
    params: {
        folder: "nestfind", //images go into a nest find folder on cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{width: 1200, height: 800, crop: "limit"}], //auto-resize
    },

});

export const upload = multer({storage});