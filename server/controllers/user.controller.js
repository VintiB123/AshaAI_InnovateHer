import bcrypt from "bcrypt";
import Mentor from "../models/mentor.model.js";
import Mentee from "../models/mentee.model.js";
import { encryptValue, decryptValue } from "../helpers/security.helper.js"; // Assuming encrypt/decrypt functions

export const loginUser = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    let userModel;

    if (userType === "MENTOR") {
      userModel = Mentor;
    } else if (userType === "MENTEE") {
      userModel = Mentee;
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Encrypt the email from the request body before querying the database
    const encryptedEmail = encryptValue(email);

    // Find the user in the database using the encrypted email
    const existingUser = await userModel.findOne({ email: encryptedEmail });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt the stored email for comparison
    const decryptedEmail = decryptValue(existingUser.email);

    if (decryptedEmail !== email) {
      return res.status(401).json({ message: "Email does not match" });
    }

    // Compare encrypted password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        userName: existingUser.userName,
        email: decryptedEmail, // Returning decrypted email
        userType: userType,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
