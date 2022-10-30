
import * as express from 'express';
import { RoutersFactory } from '.';

export class AdminRoutes {
    static create(app: express.Application, routers: RoutersFactory): express.Application {
        app.use('/api/admin/auth', routers.getAuthRoutes().create());
        app.use('/api/admin/site', routers.getSiteRoutes().create());
        app.use('/api/admin/product', routers.getProductRoutes().create());
        app.use('/api/admin/order', routers.getOrderRoutes().create());
        app.use('/api/admin/image', routers.getImageRoutes().create());

        return app;
    }

}