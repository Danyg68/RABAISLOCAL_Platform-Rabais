import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export const emailService = {
    async sendEmail({ to, subject, html }: SendEmailParams) {
        try {
            console.log(`sending email to ${to} with subject ${subject}`);
            const data = await resend.emails.send({
                from: 'RabaisLocal <onboarding@resend.dev>', // Changer pour votre domaine vérifié en prod
                to: [to],
                subject: subject,
                html: html,
            });

            return { success: true, data };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error };
        }
    }
};
