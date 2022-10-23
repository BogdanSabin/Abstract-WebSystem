import { Document } from 'mongoose';

export interface ModelType extends Document, DocType { readonly _id: string; };
// tslint:disable-next-line: no-empty-interface
export interface DocType { };

export const enum ModelNames {
    User = 'User'
}