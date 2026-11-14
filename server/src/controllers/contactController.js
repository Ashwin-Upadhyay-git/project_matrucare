import { contactSchema } from '../utils/validation.js';
import { sendMail } from '../utils/emailService.js';

export const submitContact = async (req, res, next) => {
  try {
    const payload = contactSchema.parse(req.body);

    await sendMail({
      to: 'matrucareai@gmail.com',
      subject: `New contact message from ${payload.name}`,
      text: `${payload.name} (${payload.email}) says: ${payload.message}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>MatruCare AI Contact Form</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Message:</strong></p>
          <p>${payload.message}</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    next(error);
  }
};
