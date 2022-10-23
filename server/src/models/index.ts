import { Model, Mongoose } from 'mongoose';
import { PasswordCypher } from '../bzl/lib/PasswordCypher';
import { ModelLib } from './lib/ModelLib';
import { User } from './lib/User';
import { UserModelType } from './types/UserTypes';

export class ModelsFactory {
    readonly userModelLib: ModelLib<UserModelType>;

    readonly userModel: Model<UserModelType>;

    constructor(mongoose: Mongoose, passwordCypher: PasswordCypher) {
        this.userModelLib = new User(mongoose, this, passwordCypher);

        this.userModel = this.userModelLib.Model;
    }

    getUserModel(): Model<UserModelType> { return this.userModel }
}