import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { BzlError } from './BzlError';
import { Factory } from './../../factory';
import { SiteData, NextFunction, IdData, SiteQueryData, UpdateSiteData, AnalyticsData } from '../../types';
import { config } from './../../config';
import { genericFindById, genericRmove, genericUpdate, genericQueryAll } from './common';

export interface SiteFilter {
    readonly adminId: string
}

export const create = async (data: SiteData, adminId: string, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getSiteModel();
    const ObjectId = mongoose.Types.ObjectId;
    const id = new ObjectId();
    const linkDesktop = `${config.services.desktop.protocol}://${config.services.desktop.hostname}/site/${id}`

    const newSite = new Model(_.extend({}, _.omit(data, ['token']), { adminId: adminId, linkDesktop: linkDesktop, _id: id }));
    return newSite.save()
        .then(site => { return next(null, site) })
        .catch(error => { return next(BzlError.InteralError(_.toString(error))) })
}

export const update = async (data: UpdateSiteData, filter: SiteFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getSiteModel();
    return genericUpdate(data.id, _.omit(data, ['id', 'token']), filter, Model, next);
}

export const findById = async (data: IdData, filter: SiteFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getSiteModel();
    return genericFindById(data, {}, Model, next);
}

export const queryAll = async (data: SiteQueryData, filter: SiteFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getSiteModel();
    const textSearchFilter = { $or: [] };
    const textFields: readonly string[] = ['name', 'description']
    if (!_.isEmpty(data.text)) {
        _.forEach(textFields, f => {
            textSearchFilter['$or'].push({ [f]: { $regex: new RegExp(data.text, 'i') } })
        })
    }
    const searchFilter = {
        adminId: filter.adminId,
        ...!_.isEmpty(textSearchFilter['$or']) && textSearchFilter
    };
    return genericQueryAll(searchFilter, Model, next);
}

export const remove = async (data: IdData, filter: SiteFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getSiteModel();
    return genericRmove(data, filter, Model, next);
}

export const analytics = async (data: AnalyticsData, filter: SiteFilter, next: NextFunction) => {
    switch (data.aggMethod) {
        case 'order': return topSitesByNumberOfOrders(filter, next);
        case 'user': return topSitesByNumberOfUsers(filter, next);
        case 'product': return topSitesByNumberOfProducts(filter, next);
        case 'mvpProduct': return mvpProducts(filter, next);
        default: return next(BzlError.InvalidArgument(`Invalid aggregation method ${data.aggMethod}`));
    }
}

const topSitesByNumberOfOrders = async (filter: SiteFilter, next: NextFunction) => {
    const ModelOrder = Factory.getInstance().getModels().getOrderModel();
    return analyticsAggregator(filter, ModelOrder, 'siteId', next);
}

const topSitesByNumberOfProducts = async (filter: SiteFilter, next: NextFunction) => {
    const ModelProduct = Factory.getInstance().getModels().getProductModel();
    return analyticsAggregator(filter, ModelProduct, 'siteId', next);
}


const topSitesByNumberOfUsers = async (filter: SiteFilter, next: NextFunction) => {
    const ModelUser = Factory.getInstance().getModels().getUserModel();
    return analyticsAggregator(filter, ModelUser, 'accountInSite', next);
}

const mvpProducts = async (filter: SiteFilter, next: NextFunction) => {
    const ModelProduct = Factory.getInstance().getModels().getProductModel();
    const ModelSite = Factory.getInstance().getModels().getSiteModel();
    const ModelOrder = Factory.getInstance().getModels().getOrderModel();

    return ModelSite.find(filter).select('_id name').exec()
        .then(sites => {
            const siteIds = _.map(sites, s => s._id);
            return ModelProduct.find({ siteId: { $in: siteIds } }).exec()
        })
        .then(products => {
            const productIds = _.map(products, p => p._id);
            return ModelOrder.find({ products: { $in: productIds } }).populate('products', 'fields').exec()
                .then(orders => {
                    let response = {};
                    _.forEach(orders, order => {
                        let orderObj = order.toObject();
                        _.forEach(orderObj.products, product => {
                            const productName = _.find(product.fields, f => f.key === 'name').value || '';
                            if (_.isNil(response[productName])) response[productName] = 1;
                            else response[productName] += response[productName];
                        })
                    })
                    return next(null, response)
                })
        })
        .catch(error => {
            return next(BzlError.InteralError(_.toString(error)));
        })
}

const analyticsAggregator = async (filter: SiteFilter, ResourceModel: Model<any>, siteRefKey: string, next: NextFunction) => {
    const ModelSite = Factory.getInstance().getModels().getSiteModel();

    return ModelSite.find(filter).select('_id name').exec()
        .then(sites => {
            const siteIds = _.map(sites, s => s._id);
            const siteNames = _.map(sites, s => s.name);
            return ResourceModel.find({ [siteRefKey]: { $in: siteIds } }).populate(siteRefKey, 'name').exec()
                .then(resources => {
                    let response = _.chain(resources)
                        .map(o => { return _.extend({}, o.toObject(), { [siteRefKey]: _.get(o[siteRefKey], 'name') }) })
                        .groupBy(siteRefKey)
                        .mapValues(v => v.length)
                        .value();
                    const missingSites = _.difference(siteNames, _.keys(response));
                    _.forEach(missingSites, s => response[s] = 0);
                    return next(null, response)
                })
        })
        .catch(error => {
            return next(BzlError.InteralError(_.toString(error)));
        })
}