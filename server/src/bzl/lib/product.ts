import * as _ from 'lodash';
import { BzlError } from './BzlError';
import { Factory } from './../../factory';
import { NextFunction, IdData, ProductData, UpdateProductData, ProductQueryData, IdAppData } from '../../types';
import { genericUpdate, genericFindById, genericQueryAll, genericRmove } from './common';

export interface ProductFilter {
    readonly adminId: string
}

export const create = async (data: ProductData, adminId: string, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getProductModel();
    const newProduct = new Model({
        ..._.omit(data, ['token']),
        adminId: adminId
    })
    return Factory.getInstance().getModels().getSiteModel().findOne({ _id: data.siteId, adminId: adminId })
        .then(async (site) => {
            if (!site) throw BzlError.Unauthorized('Admin is not authorized on this site ' + data.siteId);
            else {
                return newProduct.save()
            }
        })
        .then(product => { return next(null, product) })
        .catch(error => { return next(_.toString(error)) });
}

export const update = async (data: UpdateProductData, filter: ProductFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getProductModel();
    return genericUpdate(data.id, { fields: data.fields, updatedAt: new Date() }, filter, Model, next);
}

export const findById = async (data: IdAppData, filter: ProductFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getProductModel();
    return genericFindById(_.omit(data, ['app']), data.app === 'admin' ? filter : {}, Model, next);
}

export const queryAll = async (data: ProductQueryData, filter: ProductFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getProductModel();
    const textSearchFilter = { $or: [] };
    if (!_.isEmpty(data.text)) {
        textSearchFilter['$or'].push({ 'fields.value': { $regex: new RegExp(data.text, 'i') } })
    }
    const searchFilter = {
        ...data.app === 'admin' && { adminId: filter.adminId },
        ...!_.isEmpty(data.siteId) && { siteId: data.siteId },
        ...!_.isEmpty(textSearchFilter['$or']) && textSearchFilter
    };
    return genericQueryAll(searchFilter, Model, next);
}

export const remove = async (data: IdData, filter: ProductFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getProductModel();
    return genericRmove(data, filter, Model, next);
}