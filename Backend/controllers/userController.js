import User from "../models/user.js";

export const getUsers = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit).select("-password");
        res.status(200).json({
            users,
            total,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
        });


    } catch (error) {
        console.log("ERROR RETREIVING USERS", error);
        return res.status(500).json({message: "Server error"})
    }

}

export const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        return res.status(200).json({message: "User deleted successfully!"})
    } catch (error) {
        console.log("Error deleting user", error);
        return res.status(500).json({message: "Server error"});
    }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user Profile", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// export const updateProfile = async (req, res) => {
//     try {

//     } catch (error) {
//         console.log("Error updating user Profile", error);
//         return res.status(500).json({message: "Server error"});
//     }
// }
