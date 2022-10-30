import { Mongoose, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import { ModelLib } from './ModelLib';
import { ModelNames } from '../types/ModelTypes';
import { ModelsFactory } from '../index';
import * as SiteTypes from '../types/SiteTypes';

// tslint:disable: no-shadowed-variable
export class Site extends ModelLib<SiteTypes.SiteModelType>{
    protected static readonly SchemaDef: SchemaDefinition = {
        name: { type: String, required: true },
        description: { type: String, required: false },
        linkDesktop: { type: String, required: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
        productsSettings: {
            fields: [{
                _id: false,
                key: { type: String, required: true },
                type: { type: String, required: true },
                isMandatory: { type: Boolean, required: true, default: false }
            }]
        },
        ordersSettings: {
            fields: [{
                _id: false,
                key: { type: String, required: true },
                type: { type: String, required: true },
                isMandatory: { type: Boolean, required: true, default: false }
            }]
        }
    }

    readonly populateFields = {};

    protected static readonly SchemaOptions: SchemaOptions = {
        collection: ModelNames.Site,
        autoCreate: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }

    constructor(Mongoose: Mongoose, Models: ModelsFactory) {
        super(Mongoose);

        this.setSchema(Site.SchemaDef, Site.SchemaOptions);

        this.createModel(ModelNames.Site);
    }
}