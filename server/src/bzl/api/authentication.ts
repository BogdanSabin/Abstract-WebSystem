import { LoginData, NextFunction, RegisterData, ChangePasswordData, GetChangePasswordToken } from '../../types';
import { loginUser, registerUser, emailConfirmation, getChangePasswordToken, changePassword } from '../lib/authentication';

export const authAPI = {
    login: (data: LoginData, next: NextFunction) => {
        console.log('Data', data);
        return loginUser(data, next);
    },

    register: (data: RegisterData, next: NextFunction) => {
        console.log('Data', data);
        return registerUser(data, next);
    },

    emailConfirmation: (token: string, next: NextFunction) => {
        console.log('Data', token);
        return emailConfirmation(token, next);
    },

    getChangePasswordToken: (data: GetChangePasswordToken, next: NextFunction) => {
        console.log('Data', data);
        return getChangePasswordToken(data, next);
    },

    changePassword: (data: ChangePasswordData, next: NextFunction) => {
        console.log('Data', data);
        return changePassword(data, next);
    }
}