import Mentee from "../models/mentee.model.js";
import { encryptValue } from "../helpers/security.helper.js";

// Create a new mentee
export const onboardMentee = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      phoneNumber,
      currentRole,
      education,
      interests,
      goals,
      experienceLevel,
    } = req.body;

    const encryptedPassword = encryptValue(password);
    const encryptedPhoneNumber = phoneNumber ? encryptValue(phoneNumber) : null;

    const mentee = new Mentee({
      userName,
      email,
      password: encryptedPassword,
      phoneNumber: encryptedPhoneNumber,
      currentRole,
      education,
      interests,
      goals,
      experienceLevel,
    });

    await mentee.save();
    res.status(201).json(mentee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all mentees
export const getAllMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find().populate("mentor");
    res.status(200).json(mentees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a mentee by ID
export const getMenteeById = async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.params.id).populate("mentor");
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });
    res.status(200).json(mentee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a mentee by ID
export const updateMentee = async (req, res) => {
  try {
    const mentee = await Mentee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });
    res.status(200).json(mentee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a mentee by ID
export const deleteMentee = async (req, res) => {
  try {
    const mentee = await Mentee.findByIdAndDelete(req.params.id);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });
    res.status(200).json({ message: "Mentee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
