import { SiteMiddleware } from './../../middleware/SiteMiddleware';
import * as express from 'express';


export class SiteRoutes {
    private readonly siteMiddleware: SiteMiddleware;
    constructor(siteMiddleware: SiteMiddleware) {
        this.siteMiddleware = siteMiddleware;
    }

    create(): express.Router {
        const router = express.Router();

        router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.create(req, res, next);
        });

        router.put('/:siteid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.update(req, res, next);
        });

        router.delete('/:siteid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.delete(req, res, next);
        });

        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.queryAll(req, res, next);
        });

        router.get('/:siteid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.findById(req, res, next);
        });

        router.get('/data/analytics', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.siteMiddleware.analytics(req, res, next);
        });

        return router;
    }
}