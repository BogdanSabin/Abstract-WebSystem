import { DocType, ModelType } from './ModelTypes';

export interface ProductModelType extends ProductType, ModelType { }

export interface ProductType extends DocType {
    readonly siteId: string,
    readonly adminId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly fields: readonly {
        readonly key: string,
        readonly value: string,
    }[]
}