import { BzlError } from './bzl/lib/BzlError';

// tslint:disable-next-line: no-any
export type NextFunction = (error: BzlError, data?: any) => void

export interface LoginData {
    readonly site?: string,
    readonly email: string,
    readonly password: string,
    readonly app: string
}

export interface RegisterData {
    readonly accountInSite?: string,
    readonly firstName: string,
    readonly lastName?: string,
    readonly email: string,
    readonly phone?: string,
    readonly role: string,
    readonly password: string,
}

export interface ChangePasswordData {
    readonly token: string,
    readonly code: string,
    readonly newPassword: string
}

export interface GetChangePasswordToken {
    readonly email: string,
    readonly app: string
}

export interface with_token {
    readonly token: string
}

export interface AutzContext extends with_token {
    readonly method: string,
    readonly api: string
}