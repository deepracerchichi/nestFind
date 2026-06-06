import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No Token Provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

export const verifyRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (userRole !== role) {
            return res.status(403).json({message: "Access Denied"});
        }
        next();
    }
}

//Authorization: Bearer <token> ["Bearer", "token"]