import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid team member email.']
    }
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian number.']
    },
    collegeName: { type: String, required: true, trim: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    domain: { type: String, required: true },
    projectName: { type: String, required: true, trim: true, minlength: 5 },
    pptLink: { type: String, required: true, trim: true },
    prototypeLink: { type: String, required: true, trim: true },
    demoVideoLink: { type: String, default: '' },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: []
    }
  },
  { timestamps: true }
);

const HackathonRegistration = mongoose.model('HackathonRegistration', registrationSchema);
export default HackathonRegistration;
