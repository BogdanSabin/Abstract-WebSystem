import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { config } from './../../config';
import { BzlError } from './BzlError';
import { Factory } from './../../factory';
import { NextFunction, ImageUploadData, IdData, ImageQueryData } from '../../types';
import { genericRmove, genericQueryAll } from './common';

const imageScopes: readonly string[] = ['product', 'site'];
const storage = path.join(__dirname, config.volumes.images.pathBzl);

export const create = async (data: ImageUploadData, adminid: string, next: NextFunction) => {
    const imgName = `${data.fileName}.${data.extension}`;
    if (!_.includes(imageScopes, _.toLower(data.imageRefData.resourceScope))) {
        removeImageFromDisk(imgName);
        return next(BzlError.InvalidArgument(`Unknown image scope <${data.imageRefData.resourceScope}>. Required ${imageScopes}`));
    }
    else {
        const RefModel = getModelByImageScope(data.imageRefData.resourceScope);
        RefModel.findOne({ _id: data.imageRefData.resourceId, adminId: adminid })
            .then(res => {
                if (!res) {
                    removeImageFromDisk(imgName);
                    return next(BzlError.Unauthorized(`User ${adminid} not authorized on resource ${data.imageRefData.resourceId}`));
                }
                else {
                    const ImageModel = Factory.getInstance().getModels().getImageModel();

                    const imageRef = {
                        resourceScope: _.upperFirst(data.imageRefData.resourceScope),
                        resourceId: data.imageRefData.resourceId,
                        displayAs: data.imageRefData.displayAs
                    }

                    const newImage = new ImageModel({
                        _id: data.fileName,
                        adminId: adminid,
                        ...imageRef,
                        extension: data.extension
                    })

                    return newImage.save()
                        .then(image => { return next(null, image) })
                        .catch(error => { removeImageFromDisk(imgName); return next(BzlError.InteralError(_.toString(error))) })
                }
            }).catch(err => {
                removeImageFromDisk(imgName);
                return next(BzlError.InteralError(_.toString(err)));
            })
    }
}

export const findByRef = async (data: ImageQueryData, next: NextFunction) => {
    const ImageModel = Factory.getInstance().getModels().getImageModel();
    const searchFilter = {
        resourceScope: data.resourceScope,
        resourceId: data.resourceId
    };
    return genericQueryAll(searchFilter, ImageModel, (err, images) => {
        if (err) return next(err);
        else {
            // tslint:disable: no-unsafe-any
            return next(null, images[0]) //  because of the Image Model their is only one image per resourceId
        }
    });
}

export const remove = async (data: IdData, adminid: string, next: NextFunction) => {
    const ImageModel = Factory.getInstance().getModels().getImageModel();
    return genericRmove(data, { adminId: adminid }, ImageModel, (err, removedImage) => {
        if (err) return next(err);
        else {
            // tslint:disable: no-unsafe-any
            const imgName = `${removedImage._id}.${removedImage.extension}`;
            removeImageFromDisk(imgName);
            return next(null, removedImage);
        }
    });
}

const removeImageFromDisk = (imgName: string) => {
    try {
        fs.unlinkSync(path.join(storage, imgName));
    } catch (error) {
        console.log('Error while removing file from disk', error);
    }
}

// tslint:disable-next-line: no-any
const getModelByImageScope = (scope: string): Model<any> => {
    switch (_.toLower(scope)) {
        case 'product': return Factory.getInstance().getModels().getProductModel()
        case 'site': return Factory.getInstance().getModels().getSiteModel()
    }
}