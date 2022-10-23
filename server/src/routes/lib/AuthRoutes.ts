import { AuthMiddleware } from './../../middleware/AuthMiddleware';
import * as express from 'express';


export class AuthRoutes {
    private readonly authMiddleware: AuthMiddleware;
    constructor(authMiddleware: AuthMiddleware) {
        this.authMiddleware = authMiddleware;
    }

    create(): express.Router {
        const router = express.Router();

        router.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.authMiddleware.login(req, res, next);
        });

        router.post('/register', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.authMiddleware.register(req, res, next);
        });

        router.get('/confirmation/:token', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.authMiddleware.emailConfirmation(req, res, next);
        });

        router.post('/changepassword', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.authMiddleware.getChangePasswordToken(req, res, next)
        });

        router.put('/changepassword', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.authMiddleware.changePassword(req, res, next)
        });

        return router
    }
}