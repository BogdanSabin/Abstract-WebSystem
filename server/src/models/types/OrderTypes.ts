import { DocType, ModelType } from './ModelTypes';

export interface OrderModelType extends OrderType, ModelType { }

export interface OrderType extends DocType {
    readonly siteId: string,
    readonly adminId: string,
    readonly customerId: string,
    readonly products: readonly string[],
    readonly createdAt: Date,
    readonly orderInfo: readonly {
        readonly key: string,
        readonly value: string,
    }[]

}