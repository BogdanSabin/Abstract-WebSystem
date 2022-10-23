
import { Mongoose, SchemaDefinition, SchemaOptions, Schema } from 'mongoose';
import { ModelLib } from './ModelLib';
import { ModelNames } from '../types/ModelTypes';
import { ModelsFactory } from '../index';
import { UserModelType } from '../types/UserTypes';
import { PasswordCypher } from '../../bzl/lib/PasswordCypher';

// tslint:disable: no-shadowed-variable
export class User extends ModelLib<UserModelType>{
    protected static readonly SchemaDef: SchemaDefinition = {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        password: String,
        role: { type: String, enum: ['user', 'admin'] },
        accountInSite: { type: Schema.Types.ObjectId, ref: 'Site', required: false }, // only for users (not admins or master)
        emailConfirmation: { type: Boolean, default: false },
        isMaster: { type: Boolean, default: false }
    }

    protected static readonly SchemaOptions: SchemaOptions = {
        collection: ModelNames.User,
        autoCreate: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }

    constructor(Mongoose: Mongoose, Models: ModelsFactory, passwordCypher: PasswordCypher) {
        super(Mongoose);

        this.setSchema(User.SchemaDef, User.SchemaOptions);

        this.createModel(ModelNames.User);

        this.seedData([{
            _id: '100000000000000000000000',
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@abstractsystem.ro',
            password: passwordCypher.encrypt('password'),
            role: 'admin',
            isMaster: true,
            emailConfirmation: true
        }], ['_id'])
    }
}