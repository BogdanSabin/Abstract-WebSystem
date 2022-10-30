import { DocType, ModelType } from './ModelTypes';

export interface ImageModelType extends ImageType, ModelType { }

export interface ImageType extends DocType {
    readonly resourceScope: string,
    readonly adminId: string,
    readonly resourceId: string,
    readonly displayAs: string,
    readonly extension: string
}