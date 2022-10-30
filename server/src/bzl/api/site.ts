import { create, findById, queryAll, remove, update } from './../lib/site';
import { SiteData, NextFunction, IdData, SiteQueryData, UpdateSiteData } from '../../types';
import { Factory } from '../../factory';

const api = 'site';

// tslint:disable: no-unsafe-any
export const siteAPI = {
    create: async (data: SiteData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'create' })
            .then(async (userid: string) => {
                return create(data, userid, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    update: async (data: UpdateSiteData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'update' })
            .then(async (userid: string) => {
                return update(data, { adminId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    findById: async (data: IdData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'findById' })
            .then(async (userid: string) => {
                return findById(data, { adminId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    queryAll: async (data: SiteQueryData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'queryAll' })
            .then(async (userid: string) => {
                return queryAll(data, { adminId: userid }, next);
            })
            .catch(error => {
                return next(error)
            })
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