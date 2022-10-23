import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import { NextFunction } from '../../../types';
import { BzlError } from '../BzlError';
import { config } from './../../../config';
import { emailConfirmationText, emailChangePasswordText } from './textGenerator';

interface MailOptions {
    readonly from: string,
    readonly to: string,
    readonly subject: string,
    readonly html: string
}

export class Mailer {
    private readonly transporter: nodemailer.Transporter;
    private readonly from: string;
    constructor(email: string, password: string, emailService: string) {
        this.from = email;
        this.transporter = nodemailer.createTransport({
            service: emailService,
            auth: {
                user: email,
                pass: password
            },
            tls: {
                rejectUnauthorized: false
            },
            secure: false,
        });
    }


    sendConfirmationEmail(token: string, emailToSend: string, name: string, app: string, next: NextFunction): void {
        const url = `${config.services.admin.protocol}://${config.services.admin.hostname}/api/admin/auth/confirmation/${token}`

        const mailOptions = {
            from: `${_.upperFirst(app)} <${this.from}>`,
            to: emailToSend,
            subject: `Welcome to ${_.upperFirst(app)}!`,
            html: emailConfirmationText(name, url)
        };

        this.sendEmail(mailOptions, (error, info) => {
            if (error) return next(error);
            console.log('Email sent: ', info);
            return next(null, info as string);
        });
    }

    sendChangePasswordEmail(code: string, emailToSend: string, name: string, app: string, next: NextFunction): void {

        const mailOptions = {
            from: `${app} <${this.from}>`,
            to: emailToSend,
            subject: `Change password for ${app}!`,
            html: emailChangePasswordText(name, code)
        };

        this.sendEmail(mailOptions, (error, info) => {
            if (error) return next(error);
            console.log('Email change password sent: ', info);
            return next(null, info);
        });
    }

    private sendEmail(mailOptions: MailOptions, next: NextFunction): void {
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) return next(BzlError.InteralError(error.message));
            // tslint:disable-next-line: no-unsafe-any
            else return next(null, info.response);
        });
    }
}