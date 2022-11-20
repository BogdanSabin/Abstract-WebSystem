import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { LoginData, RegisterData, NextFunction, ChangePasswordData, GetChangePasswordToken } from '../../types';
import { BzlError } from './BzlError';
import { Factory } from '../../factory';
import { config } from './../../config';

const tokenSecretKey = config.auth.secret.auth;
const emailSecretKey = config.auth.secret.email;

export interface TokenPayload {
    readonly subject: string,
    readonly role: string,
    readonly isMaster: boolean
}
// tslint:disable: no-unsafe-any
export const loginUser = (data: LoginData, next: NextFunction) => {
    if (data.app !== 'admin' && _.isNil(data.site)) return next(BzlError.InvalidArgument('Site must be specified for users login!'));
    else {
        const filter = { email: data.email, role: data.app, ...data.app !== 'admin' && { accountInSite: data.site } };
        const password = data.password;
        const Model = Factory.getInstance().getModels().getUserModel();
        return Model.findOne(filter, (error, user) => {
            if (error) return next(BzlError.InteralError(error));
            if (!user) return next(BzlError.NodataFound());
            if (!user.emailConfirmation) return next(BzlError.UnauthorizedError('email must be confirmed'));

            //check if passwords match
            if (password === Factory.getInstance().getPasswordCypher().decrypt(user.password)) {
                const response = {
                    _id: user._id,
                    expiresIn: '10h',
                    role: user.isMaster ? 'master' : user.role
                };
                //create token
                const payload: TokenPayload = { subject: user._id, role: user.role, isMaster: user.isMaster };
                const token = jwt.sign(payload, tokenSecretKey, { expiresIn: '10h' });

                return next(null, _.extend({}, response, { token: token }));
            }
            else return next(BzlError.Unauthorized());
        });
    }
}

export const registerUser = (data: RegisterData, next: NextFunction) => {
    if (data.role !== 'admin' && _.isNil(data.accountInSite)) return next(BzlError.InvalidArgument('Site must be specified for users register!'));
    else {
        const filter = { email: data.email, role: data.role, ...data.role !== 'admin' && { accountInSite: data.accountInSite } };
        const Model = Factory.getInstance().getModels().getUserModel();
        //check if already exists an user with this cresentials
        return Model.findOne(filter, (error, user) => {
            if (error) return next(BzlError.InteralError(error));
            if (!user) {
                const encryptedPassword = Factory.getInstance().getPasswordCypher().encrypt(data.password);
                const newUser = new Model(_.extend({}, data, { password: encryptedPassword }));
                return newUser.save().then(() => {
                    const tokenEemail = jwt.sign({ subject: newUser._id }, emailSecretKey,
                        { expiresIn: '10h' });
                    const app = data.role === 'admin' ? 'Abstract Web System Admin' : 'Online Store';
                    Factory.getInstance().getMailer().sendConfirmationEmail(tokenEemail, newUser.email, newUser.firstName, app, (mailError) => {
                        if (mailError) {
                            console.log(mailError);
                            //delete the new created user due to email error
                            return Model.deleteOne({ _id: newUser.id }, (err) => {
                                if (err) return next(BzlError.InteralError(err.toString()));
                                return next(mailError);
                            });
                        }
                        return next(null, _.pick(newUser, ['_id', 'firstName', 'lastName', 'email']));
                    });
                });
            }
            else return next(BzlError.Collision());
        });
    }
}

export const emailConfirmation = (token: string, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getUserModel();
    if (!token) return next(BzlError.UnauthorizedError('Token missing'));
    try {
        const payload: TokenPayload = jwt.verify(token, emailSecretKey) as TokenPayload;

        if (!payload) return next(BzlError.UnauthorizedError('Payload missing'));

        const userid = payload.subject;

        return Model.updateOne({ _id: userid }, { emailConfirmation: true }, (error, mongores) => {
            if (error) return next(BzlError.InteralError(error));

            if (mongores.nModified === 0) return next(BzlError.NodataFound());

            const res = {
                redirect: `${config.services.frontEndAdmin.protocol}://${config.services.frontEndAdmin.hostname}/login`
            };

            return next(null, res);
        });
    } catch (error) {
        return next(BzlError.InteralError(error.toString()));
    }
}

export const getChangePasswordToken = (data: GetChangePasswordToken, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getUserModel();
    const email = data.email;
    if (_.isEmpty(email)) return next(BzlError.InvalidArgument('Misssing email'));
    Model.findOne({ email: email }, (error, user) => {
        if (error) return next(BzlError.InteralError(error));
        if (!user) return next(BzlError.NodataFound());
        if (!_.get(user, 'emailConfirmation')) return next(BzlError.InteralError('User must confirm his email'));

        const code = uuidv4();
        const tokenExpireIn = 300; // 5 min
        const tokenChangePassword = jwt.sign({ subject: _.get(user, '_id'), code: code }, emailSecretKey,
            { expiresIn: tokenExpireIn });

        Factory.getInstance().getMailer().sendChangePasswordEmail(code, email, _.get(user, 'firstName'), data.app, (err) => {
            if (err) return next(err);
            else return next(null, { token: tokenChangePassword });
        });
    });
}

export const changePassword = (data: ChangePasswordData, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getUserModel();
    const code = data.code;
    const newPassword = data.newPassword;
    const token = data.token;
    if (!code || !newPassword) return next(BzlError.InvalidArgument('data is not complete'));
    else {
        if (!token) return next(BzlError.UnauthorizedError('Token missing'));
        const tokenDataPart = token.split(' ')[1];
        if (tokenDataPart === 'null') return next(BzlError.UnauthorizedError('Token missing'));
        try {
            const payload = jwt.verify(tokenDataPart, emailSecretKey);

            if (!payload) return next(BzlError.UnauthorizedError('Payload missing'));

            const codeFromToken = _.get(payload, 'code', '');
            const userid = _.get(payload, 'subject', '');
            if (!userid) return next(BzlError.NodataFound());

            if (codeFromToken !== code) return next(BzlError.Forbidden());

            Model.updateOne({ _id: userid }, { password: Factory.getInstance().getPasswordCypher().encrypt(newPassword) }, (error) => {
                if (error) return next(BzlError.InteralError(error.toString()));
                else return next(null, 'Password updated');
            });

        } catch (error) {
            return next(BzlError.InteralError(error.toString()));
        }
    }
}