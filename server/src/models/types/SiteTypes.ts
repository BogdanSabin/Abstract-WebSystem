import { DocType, ModelType } from './ModelTypes';

export interface SiteModelType extends SiteType, ModelType { }

export interface SiteType extends DocType {
    readonly name: string,
    readonly description?: string,
    readonly linkDesktop: string,
    readonly adminId: string,
    readonly productsSettings: {
        readonly fields: readonly {
            readonly key: string,
            readonly type: string,
            readonly isMandatory: boolean
        }[]
    },
    readonly ordersSettings: {
        readonly fields: readonly {
            readonly key: string,
            readonly type: string,
            readonly isMandatory: boolean
        }[]
    }
}