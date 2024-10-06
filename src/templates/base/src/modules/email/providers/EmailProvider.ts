import sgMail from '@sendgrid/mail'
import { readFileSync } from 'fs'
import path, { join, resolve } from 'path'
import { compile } from 'handlebars'
import {
  SMTP_HOSTNAME, SMTP_USERNAME, SMTP_PASSWORD,
  APP_NAME, SMTP_PORT,
  APP_URL, APP_LOGO, APP_EMAIL
} from '../../../config'
import { EmailPayload } from '../interfaces'

import nodemailer from 'nodemailer'
import { logger } from '../../../core/utils'


class EmailProvider {
  public mailer = sgMail
  public transporter;

  constructor() {
    logger.info("Mail provider")
  }



  private async compileHtmlEmail(template: string, payload: object) {
    try {
      const templateSource = await readFileSync(join(resolve(__dirname, template)))

      const compiledTemplate = compile(String(templateSource))

      return compiledTemplate({
        ...payload, app: {
          name: APP_NAME, url: APP_URL, logo: APP_LOGO, email: APP_EMAIL
        }
      })
    } catch (err) {
      logger.error(err)
    }
  }

  public async sendMail({ to, subject, payload, template }: EmailPayload): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOSTNAME,
        port: 465,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
        debugger: true,
        logger: true
      });

      const html: string = await this.compileHtmlEmail(template, payload)

      const mailOptions = {
        from: SMTP_USERNAME,
        to: to,
        subject: subject,
        html: html
      };

      const info = await transporter.sendMail(mailOptions);

      if (!info) throw new Error("Unable to send mail");

      console.log('Email sent:', info);
      return info;
    } catch (error) {
      logger.error(error)
      throw new Error(`Error sending email: ${error}`)
    }
  }
}

export { EmailProvider }
