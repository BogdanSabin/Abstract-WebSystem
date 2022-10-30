import { ImageMiddleware } from './../../middleware/ImageMiddleware';
import * as express from 'express';


export class ImageRoutes {
    private readonly imageMiddleware: ImageMiddleware;
    constructor(imageMiddleware: ImageMiddleware) {
        this.imageMiddleware = imageMiddleware;
    }

    create(): express.Router {
        const router = express.Router();

        router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.imageMiddleware.upload(req, res, next);
        });

        router.get('/byref/:refid/scope/:scopeid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.imageMiddleware.findByRef(req, res, next);
        });

        router.delete('/:imageid', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.imageMiddleware.remove(req, res, next);
        });

        return router;
    }
}