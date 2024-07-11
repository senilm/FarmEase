import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authentication token missing or invalid" });
        }

        const tokenPart = authHeader.split(' ')[1];

        const payload = jwt.verify(tokenPart, process.env.JWT_SECRET)

        if (!payload) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = payload;

        next();
    } catch (error) {
        console.log(error?.message)
        return res.status(500).json({message : "You are not authorized to access this resource, Please provide valid token"})
    }
} 