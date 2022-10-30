import * as _ from 'lodash';
import { Factory } from './../../factory';
import { BzlError } from './BzlError';
import { NextFunction, IdData, OrderData, UpdateOrderData, OrderQueryData, IdAppData } from '../../types';
import { genericUpdate, genericFindById, genericRmove, genericQueryAll } from './common';

export interface OrderFilter {
    readonly userId: string
}

export const create = async (data: OrderData, userid: string, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getOrderModel();
    const ProductModel = Factory.getInstance().getModels().getProductModel();
    return ProductModel.find({ _id: { $in: data.products } }).select('siteId').populate('siteId')
        .then(async (products) => {
            if (_.isEmpty(products)) return next(BzlError.InvalidArgument('Invalid Products!'));
            const notInSiteProduct = _.find(products, p => { return _.toString(_.get(p, 'siteId._id', '')) !== data.siteId });

            if (!_.isNil(notInSiteProduct)) return next(BzlError.InvalidArgument('Products from different sites in the same order!'));

            const adminId = _.get(products, '0.siteId.adminId');
            const newOrder = new Model({
                ..._.omit(data, ['token']),
                adminId: adminId,
                customerId: userid
            })
            return newOrder.save()
        })
        .then(async (order) => { return Model.populate(order, [{ path: 'products' }, { path: 'customerId', select: 'firstName lastName email phone' }]) })
        .then(populated => { return next(null, populated) })
        .catch(error => { return next(_.toString(error)) });
}

export const update = async (data: UpdateOrderData, filter: OrderFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getOrderModel();
    const ProductModel = Factory.getInstance().getModels().getProductModel();
    return Model.findOne({ _id: data.id, adminId: filter.userId }) //only admin can update orders
        .then(order => {
            if (!order) return next(BzlError.NodataFound());
            else {
                return ProductModel.find({ _id: { $in: data.products } }).select('siteId').populate('siteId')
                    .then(async (products) => {
                        if (_.isEmpty(products)) return next(BzlError.InvalidArgument('Invalid Products!'));
                        const notInSiteProduct = _.find(products, p => { return _.toString(_.get(p, 'siteId._id', '')) !== _.toString(order.siteId) });

                        if (!_.isNil(notInSiteProduct)) return next(BzlError.InvalidArgument('Products from different sites in the same order!'));

                        return genericUpdate(data.id, data, { adminId: filter.userId }, Model, next)
                    })
            }
        })
}

export const findById = async (data: IdAppData, filter: OrderFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getOrderModel();
    const roleFilter = data.app === 'admin' ? { adminId: filter.userId } : { customerId: filter.userId };
    return Model.findOne({ _id: data.id, ...roleFilter })
        .then(order => {
            if (!order) return next(BzlError.NodataFound());
            else return Model.populate(order, [{ path: 'products' }, { path: 'customerId', select: 'firstName lastName email phone' }]).then(populated => { return next(null, populated) })
        }).catch(err => {
            return next(BzlError.InteralError(_.toString(err)));
        })
}

export const queryAll = async (data: OrderQueryData, filter: OrderFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getOrderModel();
    const searchFilter = {
        ...data.app === 'admin' && { adminId: filter.userId },
        ...data.app !== 'admin' && { customerId: filter.userId },
        ...!_.isEmpty(data.siteId) && { siteId: data.siteId },
    };
    return genericQueryAll(searchFilter, Model, (err, orders) => {
        if (err) return next(err);
        else return Model.populate(orders, [{ path: 'products' }, { path: 'customerId', select: 'firstName lastName email phone' }]).then(populated => { return next(null, populated) })
    });
}

export const remove = async (data: IdData, filter: OrderFilter, next: NextFunction) => {
    const Model = Factory.getInstance().getModels().getOrderModel();
    return genericRmove(data, { adminId: filter.userId }, Model, next);
}