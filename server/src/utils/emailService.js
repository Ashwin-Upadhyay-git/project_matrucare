import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendMail = async ({ to, subject, html, text }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('SMTP config missing. Email delivery skipped.');
    return { skipped: true };
  }

  return transporter.sendMail({
    from: '"MatruCare AI" <matrucareai@gmail.com>',
    to,
    subject,
    text,
    html
  });
};
