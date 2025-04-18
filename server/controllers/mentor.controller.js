import Mentor from "../models/mentor.model.js";
import { encryptValue } from "../helpers/security.helper.js";

export const onboardMentor = async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    const {
      userName,
      email,
      password,
      phoneNumber,
      designation, // e.g., "Senior Software Engineer"
      expertise, // Areas of expertise
      experience, // Years of experience
    } = req.body;

    // Encrypt sensitive fields
    const encryptedPassword = encryptValue(password);
    const encryptedPhoneNumber = phoneNumber ? encryptValue(phoneNumber) : null;

    const newMentor = new Mentor({
      userName,
      email,
      password: encryptedPassword,
      designation,
      expertise,
      experience,
    });

    await newMentor.save();

    res.status(201).json({ message: "Mentor onboarded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
