import mongoose from "mongoose";

const menteeSchema = new mongoose.Schema(
  {
    userName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "4242424242" },
    location: { type: String, default: "Mumbai, Maharashtra" },
    currentRole: { type: String },
    education: { type: String },
    interests: { type: [String] },
    goals: { type: [String] },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  },
  { timestamps: true }
);

const Mentee = mongoose.model("Mentee", menteeSchema);
export default Mentee;
