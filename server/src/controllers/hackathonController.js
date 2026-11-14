import HackathonRegistration from '../models/HackathonRegistration.js';
import User from '../models/User.js';
import { registrationSchema } from '../utils/validation.js';
import { sendMail } from '../utils/emailService.js';

export const registerEntry = async (req, res, next) => {
  try {
    const payload = registrationSchema.parse({ ...req.body, email: req.user.email, fullName: req.user.fullName });

    if (!req.user || !req.user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your account before registering.' });
    }

    const existing = await HackathonRegistration.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already registered for the hackathon.' });
    }

    const emailLower = payload.email.toLowerCase();
    if (payload.teamMembers.some((member) => member.email.toLowerCase() === emailLower)) {
      return res.status(400).json({ success: false, message: 'Participant email cannot be included in the team members list.' });
    }

    const seen = new Set();
    for (const member of payload.teamMembers) {
      const memberEmail = member.email.toLowerCase();
      if (seen.has(memberEmail)) {
        return res.status(400).json({ success: false, message: 'Duplicate team member emails are not allowed.' });
      }
      seen.add(memberEmail);
    }

    if (payload.teamSize !== payload.teamMembers.length + 1) {
      return res.status(400).json({ success: false, message: 'Team size and member entries are inconsistent.' });
    }

    const registration = await HackathonRegistration.create({
      userId: req.user._id,
      fullName: payload.fullName,
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      collegeName: payload.collegeName,
      course: payload.course,
      branch: payload.branch,
      yearOfStudy: payload.yearOfStudy,
      domain: payload.domain,
      projectName: payload.projectName,
      pptLink: payload.pptLink,
      prototypeLink: payload.prototypeLink,
      demoVideoLink: payload.demoVideoLink || '',
      teamSize: payload.teamSize,
      teamMembers: payload.teamMembers
    });

    await sendMail({
      to: req.user.email,
      subject: 'MatruCare AI Hackathon Registration Confirmed',
      text: `Hi ${req.user.fullName}, your registration for the ${payload.domain} track is confirmed. Project: ${payload.projectName}.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#f8fafc;color:#0f172a;">
          <h2>MatruCare AI</h2>
          <p>Hello ${req.user.fullName},</p>
          <p>Your hackathon registration has been confirmed.</p>
          <ul>
            <li><strong>Project:</strong> ${payload.projectName}</li>
            <li><strong>Domain:</strong> ${payload.domain}</li>
            <li><strong>Team Size:</strong> ${payload.teamSize}</li>
          </ul>
          <p>Thank you for registering.</p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully.',
      registration
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    next(error);
  }
};

export const getMyEntry = async (req, res) => {
  const registration = await HackathonRegistration.findOne({ userId: req.user._id });
  if (!registration) {
    return res.status(404).json({ success: false, message: 'No registration found for this user.' });
  }

  res.status(200).json({ success: true, registration });
};

export const deleteEntry = async (req, res) => {
  const registration = await HackathonRegistration.findOne({ userId: req.user._id });
  if (!registration) {
    return res.status(404).json({ success: false, message: 'Registration not found.' });
  }

  await registration.deleteOne();
  res.status(200).json({ success: true, message: 'Registration deleted successfully.' });
};
