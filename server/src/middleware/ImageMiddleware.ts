import * as express from 'express';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import { BzlError } from './../bzl/lib/BzlError';
import { RPCClient } from '../clients';
import { IdData, ImgaeReferanceData, ImageUploadData, ImageQueryData } from '../types';
import { respond, sendFile } from './helper';
import { config } from './../config';

export class ImageMiddleware {
    private readonly rpcClient: RPCClient;
    private readonly storage: string;

    constructor(client: RPCClient) {
        this.rpcClient = client;
        this.storage = path.join(__dirname, config.volumes.images.path);
    }

    upload(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            if (!fs.existsSync(this.storage)) fs.mkdirSync(this.storage, { recursive: true });
            const form = new formidable.IncomingForm({ uploadDir: this.storage, maxFieldsSize: config.volumes.images.maxSize });
            form.parse(req, (error, fields, files) => {
                if (error) { respond(res, _.toString(error), null); }
                else {
                    const referenceData = JSON.parse(fields.referenceData as string) as ImgaeReferanceData;
                    const imageData = files['imageData'] as formidable.File;

                    if (!this.isFileValid(imageData, config.volumes.images.allowedExtensions)) return respond(res, BzlError.InvalidArgument(`Invalid image type <${imageData.mimetype}>! Required: ${config.volumes.images.allowedExtensions}`), null)
                    else {
                        const ObjectId = mongoose.Types.ObjectId;
                        const fileName = _.toString(new ObjectId());
                        const extension = _.last(_.split(imageData.originalFilename, '.'));
                        fs.rename(imageData.filepath, path.join(this.storage, `${fileName}.${extension}`), (err) => {
                            if (err) respond(res, _.toString(err), null);
                            else {
                                const imageUplodData: ImageUploadData = {
                                    token: req.headers.authorization,
                                    imageRefData: referenceData,
                                    extension: extension,
                                    fileName: fileName
                                }
                                this.rpcClient.sendMessage({ api: 'image', method: 'upload', data: imageUplodData })
                                    .then(data => {
                                        return respond(res, null, data);
                                    }).catch(err2 => {
                                        return respond(res, err2, null);
                                    })
                            }
                        })
                    }
                }
            })
        } catch (error) { respond(res, _.toString(error), null); }
    }

    findByRef(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const imageQueryData: ImageQueryData = {
            token: req.headers.authorization,
            resourceScope: req.params.scopeid,
            resourceId: req.params.refid
        }
        this.rpcClient.sendMessage({ api: 'image', method: 'findByRef', data: imageQueryData })
            .then(image => {
                // tslint:disable-next-line: no-unsafe-any
                const imgName = `${image._id}.${image.extension}`;
                return sendFile(res, path.join(this.storage, imgName));
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    remove(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdData = {
            token: req.headers.authorization,
            id: req.params.imageid
        }
        this.rpcClient.sendMessage({ api: 'image', method: 'delete', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }
    private readonly isFileValid = (file: formidable.File, validTypes: readonly string[]): boolean => {
        const type = _.last(_.split(file.originalFilename, '.'));
        return validTypes.indexOf(type) === -1 ? false : true;
    }
}