import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    userName: { type: String },
    dateOfBirth: { type: Date }, // Date of birth
    email: { type: String, required: true },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: { type: String, default: "4242424242" },
    location: { type: String, default: "Mumbai, Maharashtra" },
    designation: { type: String, required: false }, // Optional position/title
    expertise: { type: [String] }, // Array of skills/expertise
    experience: { type: Number }, // Years of experience
    availability: { type: Boolean, default: true }, // Whether mentor is available
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentee" }], // References mentees
  },
  { timestamps: true }
);

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
