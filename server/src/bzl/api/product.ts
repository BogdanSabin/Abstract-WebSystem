import { Factory } from '../../factory';
import { ProductData, NextFunction, UpdateProductData, IdData, ProductQueryData, IdAppData } from '../../types';
import { create, update, findById, queryAll, remove } from '../lib/product';

const api = 'product';

// tslint:disable: no-unsafe-any
export const productAPI = {
    create: async (data: ProductData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'create' })
            .then(async (userid: string) => {
                return create(data, userid, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    update: async (data: UpdateProductData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'update' })
            .then(async (userid: string) => {
                return update(data, { adminId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    findById: async (data: IdAppData, next: NextFunction) => {
        console.log('Data', data);
        if (data.app === 'admin') {
            return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'findById' })
                .then(async (userid: string) => {
                    return findById(data, { adminId: userid }, next);
                })
                .catch(error => {
                    return next(error)
                })
        }
        else return findById(data, { adminId: '' }, next);
    },

    queryAll: async (data: ProductQueryData, next: NextFunction) => {
        console.log('Data', data);
        if (data.app === 'admin') {
            return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'queryAll' })
                .then(async (userid: string) => {
                    return queryAll(data, { adminId: userid }, next);
                })
                .catch(error => {
                    return next(error)
                })
        } else return queryAll(data, { adminId: '' }, next);
    },

    delete: async (data: IdData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'delete' })
            .then(async (userid: string) => {
                return remove(data, { adminId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    }
}