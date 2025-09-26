import { createTransport } from "nodemailer";
import config from "../config.js";
import logger from "../logger.js";

const transporter = createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.mail.user,
        pass: config.mail.password,
    },
});

interface SendMailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendMail = async ({
    to,
    subject,
    text,
    html,
}: SendMailOptions) => {
    logger.info(`Sending email to ${to} with subject ${subject}`);
    return await transporter.sendMail({
        from: `"Stratify" <${config.mail.user}>`,
        to,
        subject,
        text,
        html,
    });
};
