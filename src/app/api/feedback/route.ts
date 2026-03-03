import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, rating, message } = await req.json();

    // 1. Create the transporter (your "mailman")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This is the 16-char App Password
      },
    });

    // 2. Craft the HTML email layout
    const mailOptions = {
      from: `"PrepPath Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending it to yourself
      subject: `✨ New ${rating}-Star Feedback from ${name}`,
      html: `
        <div style="font-family: sans-serif; background: #070708; color: white; padding: 40px; border-radius: 20px;">
          <h2 style="color: #8b5cf6;">New Feedback Received</h2>
          <hr style="border: 0; border-top: 1px solid #1f2937; margin: 20px 0;" />
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Rating:</strong> ${"⭐".repeat(rating)}</p>
          <div style="background: #13131a; padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>
          <p style="font-size: 10px; color: #4b5563; margin-top: 30px;">Sent via PrepPath Feedback Portal</p>
        </div>
      `,
    };

    // 3. Send the mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}