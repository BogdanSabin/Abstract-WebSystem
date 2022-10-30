import * as express from 'express';
import * as _ from 'lodash';
import { RPCClient } from '../clients';
import { respond } from './helper';
import { SiteData, IdData, UpdateSiteData } from '../types';

export class SiteMiddleware {
    private readonly rpcClient: RPCClient;

    constructor(client: RPCClient) {
        this.rpcClient = client;
    }

    create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const siteData: SiteData = {
            token: req.headers.authorization,
            ...(_.pick(req.body, ['name', 'description', 'productsSettings', 'ordersSettings']) as SiteData)
        }
        this.rpcClient.sendMessage({ api: 'site', method: 'create', data: siteData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    update(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const siteData: UpdateSiteData = {
            id: req.params.siteid,
            token: req.headers.authorization,
            ...(_.pick(req.body, ['name', 'description', 'productsSettings', 'ordersSettings']) as SiteData)
        }
        this.rpcClient.sendMessage({ api: 'site', method: 'update', data: siteData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    findById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdData = {
            token: req.headers.authorization,
            id: req.params.siteid
        }
        this.rpcClient.sendMessage({ api: 'site', method: 'findById', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    queryAll(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const queryData = {
            token: req.headers.authorization,
            adminId: req.query.adminid,
            ...!_.isEmpty(req.query.text) && { text: (req.query.text as string) }
        }
        this.rpcClient.sendMessage({ api: 'site', method: 'queryAll', data: queryData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

    delete(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const idData: IdData = {
            token: req.headers.authorization,
            id: req.params.siteid
        }
        this.rpcClient.sendMessage({ api: 'site', method: 'delete', data: idData })
            .then(data => {
                return respond(res, null, data);
            }).catch(error => {
                return respond(res, error, null);
            })
    }

}