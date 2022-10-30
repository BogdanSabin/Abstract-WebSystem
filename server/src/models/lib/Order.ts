import { Mongoose, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import { ModelLib } from './ModelLib';
import { ModelNames } from '../types/ModelTypes';
import { ModelsFactory } from '../index';
import * as OrderTypes from '../types/OrderTypes';

// tslint:disable: no-shadowed-variable
export class Order extends ModelLib<OrderTypes.OrderModelType>{
    protected static readonly SchemaDef: SchemaDefinition = {
        siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
        createdAt: { type: Date, required: false, default: () => Date.now() },
        orderInfo: [{
            _id: false,
            key: { type: String, required: true },
            value: { type: String, required: true }
        }]
    }

    readonly populateFields = {};

    protected static readonly SchemaOptions: SchemaOptions = {
        collection: ModelNames.Order,
        autoCreate: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }

    constructor(Mongoose: Mongoose, Models: ModelsFactory) {
        super(Mongoose);

        this.setSchema(Order.SchemaDef, Order.SchemaOptions);

        this.createModel(ModelNames.Order);
    }
}