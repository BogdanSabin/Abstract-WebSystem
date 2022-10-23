import { MiddlewareFactory } from './../middleware/index';
import { AuthRoutes } from './lib/AuthRoutes';

export class RoutersFactory {
    private readonly authRoutes: AuthRoutes;

    constructor(middlewareFactory: MiddlewareFactory) {
        this.authRoutes = new AuthRoutes(middlewareFactory.getAuthMiddleware());
    }

    getAuthRoutes(): AuthRoutes { return this.authRoutes; }
}