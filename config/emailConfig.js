import nodemailer from 'nodemailer';

export const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};
