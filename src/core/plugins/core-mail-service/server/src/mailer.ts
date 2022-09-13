import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CONFIG } from './config';

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

export class MailService {
    static init() {
        transporter = nodemailer.createTransport({
            host: CONFIG.MAIL_SERVICE.HOST,
            port: CONFIG.MAIL_SERVICE.PORT,
            auth: {
                user: CONFIG.MAIL_SERVICE.USER,
                pass: CONFIG.MAIL_SERVICE.PASSWORD,
            },
        });
    }

    static get(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> | undefined {
        return transporter;
    }

    /**
     * Simply send an email with nodemailer.
     *
     * @static
     * @param {string} to
     * @param {string} subject
     * @param {string} text
     * @return {*}
     * @memberof MailService
     */
    static async send(to: string, subject: string, text: string) {
        if (!transporter) {
            throw new Error('Mail Service did not initialize.');
        }

        const didSend = await transporter
            .sendMail({ from: CONFIG.MAIL_SERVICE.FROM, to, subject, text })
            .catch((err) => {
                console.error(new Error(err));
                return false;
            })
            .then(() => {
                return true;
            });

        if (!didSend) {
            return;
        }

        console.log(`Email Sent: ${subject}`);
    }
}
