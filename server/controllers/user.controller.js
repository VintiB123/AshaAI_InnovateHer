import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { encryptValue, decryptValue } from "../helpers/security.helper.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Encrypt name and email
    const encryptedName = encryptValue(name);
    const encryptedEmail = encryptValue(email);

    const newUser = new User({
      name: encryptedName,
      email: encryptedEmail,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find all users (since email is encrypted)
    const users = await User.find();

    // Loop through users and find one with matching decrypted email
    let foundUser = null;
    for (const user of users) {
      const decryptedEmail = decryptValue(user.email);
      if (decryptedEmail === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Optionally decrypt and return user name
    const decryptedName = decryptValue(foundUser.name);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: foundUser._id,
        name: decryptedName,
        email: email, // Already known
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
