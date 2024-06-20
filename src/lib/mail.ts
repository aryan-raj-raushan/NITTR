import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import nodeMailer from 'nodemailer';

type TmailOptions = {
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
}

export async function sendMail({ to, subject, text, templatePath, context }: { to: string, subject: string, text: string, templatePath?: string, context?: any }) {
  try {
    const transporter = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'aakash2330@gmail.com',
        pass: 'wwoo aczo vepw rwne',
      }
    });

    let html = '';
    if (templatePath && context) {
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      html = template(context);
    }

    const mailOptions: TmailOptions = {
      from: 'aakash2330@gmail.com',
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
}
