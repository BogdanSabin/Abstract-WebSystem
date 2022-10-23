
import * as express from 'express';
import { RoutersFactory } from '.';

export class AdminRoutes {
    static create(app: express.Application, routers: RoutersFactory): express.Application {
        app.use('/api/admin/auth', routers.getAuthRoutes().create());

        return app;
    }

}