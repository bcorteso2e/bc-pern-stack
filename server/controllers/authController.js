import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";


export const signup = async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		if (!name || !email || !password || !confirmPassword) {
			return res.status(400).json({error: 'Please fill in all fields'})
		}

		if (password !== confirmPassword) {
			return res.status(400).json({error: "Passwords don't match"})
		}

		const userExists = await prisma.user.findUnique({ where: { email } });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const newUser = await prisma.user.create({
			data: { name, email, password: hashedPassword },
		});

		if (newUser) {

			generateToken(newUser.id, res)

			res.status(201).json({
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			});
		}else{
			res.status(400).json({error: "Invalid user data"})
		}

	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
    try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			res.status(400).json({ error: "Invalid credentials" });
            return
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {
			res.status(400).json({ error: "Invalid credentials" });
            return
		}

		generateToken(user.id, res);

		res.status(200).json({
			id: user.id,
			name: user.name
		});

	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}


export const logout = async (req, res) => {
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.id } });

		if (!user) {
			res.status(404).json({ error: "User not found" });
            return
		}

		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

