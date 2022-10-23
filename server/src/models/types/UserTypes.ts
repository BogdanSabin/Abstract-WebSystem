import { DocType, ModelType } from './ModelTypes';

export interface UserModelType extends UserType, ModelType { }

export interface UserType extends DocType {
    readonly firstName: string,
    readonly lastName?: string,
    readonly email: string,
    readonly phone?: string,
    readonly role: 'user' | 'admin',
    readonly accountInSite?: string, // only for users (not admins or master)
    readonly password: string,
    readonly emailConfirmation: boolean,
    readonly isMaster: boolean,
}