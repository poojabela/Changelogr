import { type Mail } from "./types.server";
import nodemailer from "nodemailer";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function sendEmail(mail: Mail) {
  const message = {
    to: mail.to,
    subject: `Here's your OTP Code!`,
    html: `<h1>Code: ${mail.code}</h1>`,
  };

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "poojabelaramani51@gmail.com",
      pass: BREVO_API_KEY,
    },
  });

  await transporter.sendMail({
    from: "poojabelaramani51@gmail.com",
    ...message,
  });

  return true;
}
