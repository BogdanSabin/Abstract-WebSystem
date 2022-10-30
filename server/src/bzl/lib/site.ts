import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { BzlError } from './BzlError';
import { Factory } from './../../factory';
import { SiteData, NextFunction, IdData, SiteQueryData, UpdateSiteData } from '../../types';
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
    const linkMobile = `${config.services.mobile.protocol}://${config.services.mobile.hostname}/site/${id}`

    const newSite = new Model(_.extend({}, _.omit(data, ['token']), { adminId: adminId, linkDesktop: linkDesktop, linkMobile: linkMobile, _id: id }));
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