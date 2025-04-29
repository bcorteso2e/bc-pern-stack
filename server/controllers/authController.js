import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await prisma.user.findUnique({ where: { email } });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { name, email, password: hashedPassword },
		});

		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		});

	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });

		if (user && (await bcrypt.compare(password, user.password))) {
		
			res.json({
				_id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	
};


