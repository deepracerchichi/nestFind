import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "nestfind", //images go into a nest find folder on cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{width: 1200, height: 800, crop: "limit"}], //auto-resize
    },

});

export const upload = multer({storage});
export default cloudinary;