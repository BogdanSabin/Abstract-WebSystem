import { Mongoose, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import { ModelLib } from './ModelLib';
import { ModelNames } from '../types/ModelTypes';
import { ModelsFactory } from '../index';
import * as ProductTypes from '../types/ProductTypes';

// tslint:disable: no-shadowed-variable
export class Product extends ModelLib<ProductTypes.ProductModelType>{
    protected static readonly SchemaDef: SchemaDefinition = {
        siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, required: false, default: () => Date.now() },
        updatedAt: { type: Date, required: false },
        fields: [{
            _id: false,
            key: { type: String, required: true },
            value: { type: String, required: true }
        }]
    }

    readonly populateFields = {};

    protected static readonly SchemaOptions: SchemaOptions = {
        collection: ModelNames.Product,
        autoCreate: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }

    constructor(Mongoose: Mongoose, Models: ModelsFactory) {
        super(Mongoose);

        this.setSchema(Product.SchemaDef, Product.SchemaOptions);

        this.createModel(ModelNames.Product);
    }
}