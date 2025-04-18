import { decryptValue } from "../helpers/security.helper.js";
import Mentee from "../models/mentee.model.js";
import Mentor from "../models/mentor.model.js";
import bcrypt from "bcrypt"

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let user;
        if (role === "MENTEE") {
            user = await Mentee.findOne({ email });
        } else if (role === "MENTOR") {
            user = await Mentor.findOne({ email });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const decryptedPassword = await decryptValue(user.password);

        if (password !== decryptedPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const { password: _, ...userData } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userData,
            role
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { role, ...userData } = req.body;

        if (!role || !userData.email || !userData.password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        let existingUser;
        if (role === "MENTEE") {
            existingUser = await Mentee.findOne({ email: userData.email });
        } else if (role === "MENTOR") {
            existingUser = await Mentor.findOne({ email: userData.email });
        }

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        let newUser;
        if (role === "MENTEE") {
            newUser = new Mentee({
                ...userData,
                password: hashedPassword
            });
        } else if (role === "MENTOR") {
            newUser = new Mentor({
                ...userData,
                password: hashedPassword
            });
        }

        await newUser.save();

        const { password: _, ...createdUser } = newUser.toObject();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser,
            role
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};