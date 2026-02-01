import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!, // Gmail App Password (recommended)
    },
});

export const sendEmail = async (opts: { to: string; subject: string; html: string }) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
    });
};
