import { Factory } from '../../factory';
import { NextFunction, IdData, OrderData, UpdateOrderData, OrderQueryData, IdAppData } from '../../types';
import { create, update, findById, queryAll, remove } from '../lib/order';

const api = 'order';

// tslint:disable: no-unsafe-any
export const orderAPI = {
    create: async (data: OrderData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'create' })
            .then(async (userid: string) => {
                return create(data, userid, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    update: async (data: UpdateOrderData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'update' })
            .then(async (userid: string) => {
                return update(data, { userId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    findById: async (data: IdAppData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'findById' })
            .then(async (userid: string) => {
                return findById(data, { userId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    queryAll: async (data: OrderQueryData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'queryAll' })
            .then(async (userid: string) => {
                return queryAll(data, { userId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    delete: async (data: IdData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'delete' })
            .then(async (userid: string) => {
                return remove(data, { userId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    }
}