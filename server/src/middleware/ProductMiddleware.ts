import * as express from 'express';
import * as _ from 'lodash';
import { BzlError } from './../bzl/lib/BzlError';
import { respond } from './helper';
import { RPCClient } from '../clients';
import { IdData, ProductData, UpdateProductData, ProductQueryData, IdAppData } from '../types';

export class ProductMiddleware {
    private readonly rpcClient: RPCClient;

    constructor(client: RPCClient) {
        this.rpcClient = client;
    }

    create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const productData: ProductData = {
            token: req.headers.authorization,
            ...(_.pick(req.body, ['fields', 'siteId']) as ProductData)
        }
        if (_.isEmpty(productData.siteId)) respond(res, BzlError.InvalidArgument('SiteId is mandatory'), null);
        else {
            this.rpcClient.sendMessage({ api: 'product', method: 'create', data: productData })
                .then(data => {
                    return respond(res, null, data);
                }).catch(error => {
                    return respond(res, error, null);
                })
        }
    }

    update(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const productData: UpdateProductData = {
            id: req.params.productid,
            token: req.headers.authorization,
            ...(_.pick(req.body, ['fields']) as UpdateProductData)
        }
        this.rpcClient.sendMessage({ api: 'product', method: 'update', data: productData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    findById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdAppData = {
            token: req.headers.authorization,
            id: req.params.productid,
            app: process.env.serverName === 'admin' ? 'admin' : 'user'
        }
        this.rpcClient.sendMessage({ api: 'product', method: 'findById', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    queryAll(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const queryData: ProductQueryData = {
            token: req.headers.authorization,
            siteId: req.query.siteId as string,
            app: process.env.serverName === 'admin' ? 'admin' : 'user',
            ...!_.isEmpty(req.query.text) && { text: (req.query.text as string) }
        }
        this.rpcClient.sendMessage({ api: 'product', method: 'queryAll', data: queryData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    delete(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdData = {
            token: req.headers.authorization,
            id: req.params.productid
        }
        this.rpcClient.sendMessage({ api: 'product', method: 'delete', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

}