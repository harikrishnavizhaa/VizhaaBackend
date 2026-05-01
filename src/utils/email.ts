import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // default test email
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};
