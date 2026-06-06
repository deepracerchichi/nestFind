
export const uploadImage = async (req, res) => {
    try {
        //multer + cloudinary puts the results in req.files
        const urls = req.files.map((file) => file.path);
        res.status(200).json({urls});

    } catch (e) {
        console.error("Error uploading image", e);
        res.status(500).json({message: "Upload failed"});
    }
}