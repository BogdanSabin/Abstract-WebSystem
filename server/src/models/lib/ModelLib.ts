import mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export abstract class ModelLib<ModelType extends mongoose.Document> {
    // tslint:disable-next-line: readonly-keyword
    Model: mongoose.Model<ModelType>;
    // tslint:disable-next-line: readonly-keyword
    protected Schema: mongoose.Schema;
    private readonly Mongoose: mongoose.Mongoose;

    readonly setSchema = (def: mongoose.SchemaDefinition, opts: mongoose.SchemaOptions) => {
        this.Schema = new this.Mongoose.Schema(def, opts);
    }

    readonly createModel = (modelName: string) => {
        this.Model = this.Mongoose.model<ModelType>(modelName, this.Schema);
    }

    // tslint:disable-next-line: no-any
    readonly seedData = (data: readonly any[], searchFields: readonly string[]) => {
        return Promise.each(data, entry => {
            // tslint:disable-next-line: no-any
            const searchFilter = _.pick(entry, searchFields) as unknown as any;
            // tslint:disable-next-line: no-unsafe-any
            return this.Model.findOneAndUpdate(searchFilter, { $setOnInsert: entry }, { upsert: true });
        })
    }

    constructor(Mongoose: mongoose.Mongoose) {
        this.Mongoose = Mongoose;
    }
}