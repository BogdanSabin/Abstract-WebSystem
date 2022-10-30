
import * as express from 'express';
import { RoutersFactory } from '.';

export class DesktopRoutes {
    static create(app: express.Application, routers: RoutersFactory): express.Application {
        app.use('/api/desktop/auth', routers.getAuthRoutes().create());
        app.use('/api/desktop/site', routers.getSiteRoutes().create());
        app.use('/api/desktop/product', routers.getProductRoutes().create());
        app.use('/api/desktop/order', routers.getOrderRoutes().create());
        app.use('/api/desktop/image', routers.getImageRoutes().create());

        return app;
    }

}