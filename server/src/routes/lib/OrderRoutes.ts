import { OrderMiddleware } from './../../middleware/OrderMiddleware';
import * as express from 'express';


export class OrderRoutes {
    private readonly orderMiddleware: OrderMiddleware;
    constructor(orderMiddleware: OrderMiddleware) {
        this.orderMiddleware = orderMiddleware;
    }

    create(): express.Router {
        const router = express.Router();

        router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.orderMiddleware.create(req, res, next);
        });

        router.put('/:orderid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.orderMiddleware.update(req, res, next);
        });

        router.delete('/:orderid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.orderMiddleware.delete(req, res, next);
        });

        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.orderMiddleware.queryAll(req, res, next);
        });

        router.get('/:orderid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.orderMiddleware.findById(req, res, next);
        });

        return router;
    }
}