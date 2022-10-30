import * as _ from 'lodash';
import { Model } from 'mongoose';
import { IdData, NextFunction } from '../../types';
import { BzlError } from './BzlError';

// tslint:disable: no-any
type UpdateData = any;
type QueryAllFilter = any;
interface AdminIdFiler {
    readonly adminId?: string
}

export const genericUpdate = async (resourceId: string, data: UpdateData, filter: AdminIdFiler, ResourceModel: Model<any>, next: NextFunction) => {
    return ResourceModel.findOneAndUpdate({ _id: resourceId, ...!_.isNil(filter.adminId) && { adminId: filter.adminId } }, _.omit(data, ['id', 'token']), { new: true })
        .then(res => {
            if (!res) next(BzlError.NodataFound());
            else return next(null, res);
        }).catch(err => {
            return next(BzlError.InteralError(_.toString(err)));
        })
}

export const genericFindById = async (data: IdData, filter: AdminIdFiler, ResourceModel: Model<any>, next: NextFunction) => {
    return ResourceModel.findOne({ _id: data.id, ...!_.isNil(filter.adminId) && { adminId: filter.adminId } })
        .then(res => {
            if (!res) next(BzlError.NodataFound());
            else return next(null, res);
        }).catch(err => {
            return next(BzlError.InteralError(_.toString(err)));
        })
}

export const genericQueryAll = async (searchFilter: QueryAllFilter, ResourceModel: Model<any>, next: NextFunction) => {
    // tslint:disable: no-unsafe-any
    return ResourceModel.find(searchFilter)
        .then(res => {
            if (_.isEmpty(res)) next(BzlError.NodataFound());
            else return next(null, res);
        }).catch(err => {
            return next(BzlError.InteralError(_.toString(err)));
        })
}

export const genericRmove = async (data: IdData, filter: AdminIdFiler, ResourceModel: Model<any>, next: NextFunction) => {
    return ResourceModel.findOneAndDelete({ _id: data.id, ...!_.isNil(filter.adminId) && { adminId: filter.adminId } })
        .then(res => {
            if (!res) next(BzlError.NodataFound());
            else return next(null, res);
        }).catch(err => {
            return next(BzlError.InteralError(_.toString(err)));
        })
}