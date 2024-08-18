// api/sendVerificationEmail.ts
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const { email } = req.body;

  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the verification code in your database associated with the user
  // For simplicity, this example skips the database part

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Your App" <your-email@gmail.com>',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is ${verificationCode}`,
    html: `<b>Your verification code is ${verificationCode}</b>`
  });

  res.status(200).json({ message: 'Verification email sent', code: verificationCode });
}