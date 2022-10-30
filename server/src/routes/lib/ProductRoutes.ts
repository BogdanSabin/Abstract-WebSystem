import { ProductMiddleware } from './../../middleware/ProductMiddleware';
import * as express from 'express';


export class ProductRoutes {
    private readonly productMiddleware: ProductMiddleware;
    constructor(productMiddleware: ProductMiddleware) {
        this.productMiddleware = productMiddleware;
    }

    create(): express.Router {
        const router = express.Router();

        router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.productMiddleware.create(req, res, next);
        });

        router.put('/:productid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.productMiddleware.update(req, res, next);
        });

        router.delete('/:productid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.productMiddleware.delete(req, res, next);
        });

        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.productMiddleware.queryAll(req, res, next);
        });

        router.get('/:productid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.productMiddleware.findById(req, res, next);
        });

        return router;
    }
}