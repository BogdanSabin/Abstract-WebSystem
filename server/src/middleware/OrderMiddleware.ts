import * as _ from 'lodash';
import * as express from 'express';
import { OrderData, UpdateOrderData, IdData, OrderQueryData, IdAppData } from './../types';
import { respond } from './helper';
import { RPCClient } from '../clients';
import { BzlError } from '../bzl/lib/BzlError';

export class OrderMiddleware {
    private readonly rpcClient: RPCClient;

    constructor(client: RPCClient) {
        this.rpcClient = client;
    }

    create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const orderData: OrderData = {
            token: req.headers.authorization,
            ...(_.pick(req.body, ['products', 'siteId', 'orderInfo']) as OrderData)
        }
        if (_.isEmpty(orderData.siteId)) respond(res, BzlError.InvalidArgument('SiteId is mandatory'), null);
        else if (_.isEmpty(orderData.products)) respond(res, BzlError.InvalidArgument('Could not creare Order without products'), null);
        else {
            this.rpcClient.sendMessage({ api: 'order', method: 'create', data: orderData })
                .then(data => {
                    return respond(res, null, data);
                }).catch(error => {
                    return respond(res, error, null);
                })
        }
    }

    update(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const orderData: UpdateOrderData = {
            id: req.params.orderid,
            token: req.headers.authorization,
            ...(_.pick(req.body, ['products', 'orderInfo']) as UpdateOrderData)
        }
        this.rpcClient.sendMessage({ api: 'order', method: 'update', data: orderData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    findById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdAppData = {
            token: req.headers.authorization,
            id: req.params.orderid,
            app: process.env.serverName === 'admin' ? 'admin' : 'user'
        }
        this.rpcClient.sendMessage({ api: 'order', method: 'findById', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    queryAll(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const queryData: OrderQueryData = {
            token: req.headers.authorization,
            app: process.env.serverName === 'admin' ? 'admin' : 'user',
            ...!_.isEmpty(req.query.siteId) && { siteId: (req.query.siteId as string) }
        }
        if (_.isEmpty(queryData.siteId)) respond(res, BzlError.InvalidArgument('SiteId is mandatory'), null);
        else {
            this.rpcClient.sendMessage({ api: 'order', method: 'queryAll', data: queryData })
                .then(data => {
                    return respond(res, null, data);
                }).catch(error => {
                    return respond(res, error, null);
                })
        }
    }

    delete(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdData = {
            token: req.headers.authorization,
            id: req.params.orderid
        }
        this.rpcClient.sendMessage({ api: 'order', method: 'delete', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }
}