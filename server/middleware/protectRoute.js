import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

const protectRoute = async (req, res, next) => {
	try {
        
		const token = req.cookies.jwt;

		if (!token) {
			res.status(401).json({ error: "Unauthorized - No token provided" });
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded || !decoded.userId) {
			res.status(401).json({ error: "Unauthorized - Invalid Token" });
			return;
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, name: true, email: true },
		});

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default protectRoute;
