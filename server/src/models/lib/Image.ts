import { Mongoose, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import { ModelLib } from './ModelLib';
import { ModelNames } from '../types/ModelTypes';
import { ModelsFactory } from '../index';
import * as ImageTypes from '../types/ImageTypes';

// tslint:disable: no-shadowed-variable
export class Image extends ModelLib<ImageTypes.ImageModelType>{
    protected static readonly SchemaDef: SchemaDefinition = {
        resourceScope: { type: String, required: true, enum: ['Product', 'Site'] },
        resourceId: { type: Schema.Types.ObjectId, refPath: 'resourceScope', required: true, unique: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        displayAs: { type: String, required: true },
        extension: { type: String, required: true }
    }

    readonly populateFields = {};

    protected static readonly SchemaOptions: SchemaOptions = {
        collection: ModelNames.Image,
        autoCreate: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }

    constructor(Mongoose: Mongoose, Models: ModelsFactory) {
        super(Mongoose);

        this.setSchema(Image.SchemaDef, Image.SchemaOptions);

        this.createModel(ModelNames.Image);

        this.seedData([{
            _id: '300000000000000000000001',
            resourceScope: 'Site',
            resourceId: '200000000000000000000001',
            adminId: '100000000000000000000000',
            displayAs: 'thumbnail',
            extension: 'png'
        },
        {
            _id: '300000000000000000000002',
            resourceScope: 'Site',
            resourceId: '200000000000000000000002',
            adminId: '100000000000000000000000',
            displayAs: 'thumbnail',
            extension: 'png'
        }], ['_id'])
    }
}