import * as express from 'express';
import * as _ from 'lodash';
import { LoginData, RegisterData, ChangePasswordData, GetChangePasswordToken } from './../types';
import { RPCClient } from '../clients';
import { respond, redirect } from './helper';

export class AuthMiddleware {
    private readonly rpcClient: RPCClient;

    constructor(client: RPCClient) {
        this.rpcClient = client;
    }

    login(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const loginData: LoginData = _.extend({}, req.body, { app: process.env.serverName === 'admin' ? 'admin' : 'user' }) as LoginData;
        this.rpcClient.sendMessage({ api: 'auth', method: 'login', data: loginData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    register(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const registerData: RegisterData = _.extend({}, req.body, { role: process.env.serverName === 'admin' ? 'admin' : 'user' }) as RegisterData;
        this.rpcClient.sendMessage({ api: 'auth', method: 'register', data: registerData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    emailConfirmation(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const token: string = req.params.token;
        this.rpcClient.sendMessage({ api: 'auth', method: 'emailConfirmation', data: token })
            .then(data => {
                return redirect(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    getChangePasswordToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const getChangePasswordToken: GetChangePasswordToken = {
            email: (_.get(req.body, 'email', '') as string),
            app: process.env.serverName === 'admin' ? 'Admin Abstract Web System' : 'Online Store'
        }
        this.rpcClient.sendMessage({ api: 'auth', method: 'getChangePasswordToken', data: getChangePasswordToken })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    changePassword(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const changePasswordData: ChangePasswordData = {
            token: req.headers.authorization,
            code: (_.get(req.body, 'code', '') as string),
            newPassword: (_.get(req.body, 'newPassword', '') as string)
        }
        this.rpcClient.sendMessage({ api: 'auth', method: 'changePassword', data: changePasswordData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }
}