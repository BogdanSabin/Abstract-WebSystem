import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { AutzContext, NextFunction } from '../../../types';
import { BzlError } from '../BzlError';
import { config } from './../../../config';
import { Factory } from './../../../factory';
import { TokenPayload } from '../authentication';
import { registry } from './MethodAutorization';

const tokenSecretKey = config.auth.secret.auth;

export const authorize = (autzData: AutzContext, next: NextFunction) => {
    const ModelUser = Factory.getInstance().getModels().getUserModel();
    const token = autzData.token;
    if (!token) return next(BzlError.UnauthorizedError('Token missing'));

    const tokenPart = token.split(' ')[1];

    if (tokenPart === 'null') return next(BzlError.UnauthorizedError('Token missing'));
    try {
        const payload = jwt.verify(tokenPart, tokenSecretKey) as TokenPayload;

        if (!payload) return next(BzlError.UnauthorizedError('Payload missing'));

        if (!payload.isMaster) {
            // tslint:disable-next-line: no-unsafe-any
            if (!registry[payload.role][autzData.api][autzData.method]) {
                return next(BzlError.UnauthorizedError(`User in not authorize in context ${payload.role}.${autzData.api}.${autzData.method}`));
            }
        }

        const userid = payload.subject;

        ModelUser.findById(userid, (error, user) => {
            if (error) return next(BzlError.InteralError(_.toString(error)));
            if (!user) return next(BzlError.UnauthorizedError('No user found based on token'));
            return next(null, userid);
        });

    } catch (error) {
        return next(BzlError.InteralError(_.toString(error)))
    }
}