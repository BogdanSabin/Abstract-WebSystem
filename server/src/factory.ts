import { Mailer } from './bzl/lib/notifier/Mailer';
import mongoose from 'mongoose';
import * as Promise from 'bluebird';
import { config } from './config';
import { CoreBzlRpcClient } from './clients/coreBzlClient';
import { ModelsFactory } from './models/index';
import { MiddlewareFactory } from './middleware';
import { RoutersFactory } from './routes';
import { PasswordCypher } from './bzl/lib/PasswordCypher';
import { AuthorizatorRpcClient } from './clients/authorizatorClient';


export class Factory {
    private readonly passwordCypher: PasswordCypher;
    private readonly authorizatorRpcClient: AuthorizatorRpcClient;
    private readonly routersFactory: RoutersFactory;
    private readonly middlewareFactory: MiddlewareFactory;
    private readonly models: ModelsFactory;
    private readonly mongoose: mongoose.Mongoose;
    private readonly mailer: Mailer;
    // tslint:disable-next-line: readonly-keyword
    private static instance: Factory;

    private constructor() {
        this.passwordCypher = new PasswordCypher(config.crypto.algorithm, config.crypto.key, config.crypto.iv);
        // tslint:disable-next-line: no-floating-promises
        mongoose.connect(config.mongodb, {});
        mongoose.Promise = Promise;
        this.mongoose = mongoose;
        this.models = new ModelsFactory(this.mongoose, this.passwordCypher);

        this.mailer = new Mailer(config.auth.email.email, config.auth.email.password, config.auth.email.type);

        this.authorizatorRpcClient = new AuthorizatorRpcClient(config.rpc.autorizator.queueName);
        const coreBzlRpcClient = new CoreBzlRpcClient(config.rpc.coreBzl.queueName);
        this.middlewareFactory = new MiddlewareFactory(coreBzlRpcClient);
        this.routersFactory = new RoutersFactory(this.middlewareFactory);
        Factory.instance = this;
    }

    static getInstance(): Factory { return Factory.instance ? Factory.instance : new Factory() }
    getMiddelware(): MiddlewareFactory { return this.middlewareFactory }
    getRouter(): RoutersFactory { return this.routersFactory }
    getModels(): ModelsFactory { return this.models }
    getPasswordCypher(): PasswordCypher { return this.passwordCypher }
    getMailer(): Mailer { return this.mailer }
    getAutzClient(): AuthorizatorRpcClient { return this.authorizatorRpcClient }
}