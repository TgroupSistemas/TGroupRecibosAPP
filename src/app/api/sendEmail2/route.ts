import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email, pass } = await req.json();
    console.log(email, pass);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nueva contraseña Portal de Sueldos',
      text: `Tu nueva contraseña es: ${pass}`,
      html: `
<table role="presentation" style="width: 100%; background-color: #e0e0e0; border: 0; padding: 10em 3em; margin: 0;">
  <tr>
    <td align="center" valign="middle">
      <table role="presentation" style="background-color: #fff;  padding: 20px 60px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; line-height: 1.6; text-align: center;">
        <tr>
          <td>
            <h2 style="color: #333;">Código de Verificación Tgroup</h2>
            <p>¡Hola!</p>
            <p>Tu nueva contraseña es:</p>
            <p style="font-size: 24px; text-align: center; font-weight: bold; color: #4CAF50; border: 1px solid #4CAF50; border-radius: 10px; padding: 10px;">${pass}</p>
            <p>Para cambiar...</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
