import { ImageUploadData, NextFunction, IdData, ImageQueryData } from '../../types';
import { Factory } from '../../factory';
import { create, remove, findByRef } from '../lib/image';

const api = 'image';

// tslint:disable: no-unsafe-any
export const imageAPI = {
    upload: async (data: ImageUploadData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'upload' })
            .then(async (adminid: string) => {
                return create(data, adminid, next);
            })
            .catch(error => {
                return next(error)
            })
    },

    findByRef: async (data: ImageQueryData, next: NextFunction) => {
        console.log('Data', data);
        // return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'findByRef' })
        // .then(async (userid: string) => {
        return findByRef(data, next);
        // })
        // .catch(error => {
        // return next(error)
        // })
    },

    delete: async (data: IdData, next: NextFunction) => {
        console.log('Data', data);
        return Factory.getInstance().getAutzClient().authorize({ token: data.token, api: api, method: 'delete' })
            .then(async (adminid: string) => {
                return remove(data, adminid, next);
            })
            .catch(error => {
                return next(error)
            })
    }
}