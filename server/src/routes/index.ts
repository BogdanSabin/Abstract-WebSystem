import { MiddlewareFactory } from './../middleware/index';
import { AuthRoutes } from './lib/AuthRoutes';
import { SiteRoutes } from './lib/SiteRoutes';
import { ProductRoutes } from './lib/ProductRoutes';
import { ImageRoutes } from './lib/ImageRoutes';
import { OrderRoutes } from './lib/OrderRoutes';

export class RoutersFactory {
    private readonly authRoutes: AuthRoutes;
    private readonly siteRoutes: SiteRoutes;
    private readonly productRoutes: ProductRoutes;
    private readonly orderRoutes: OrderRoutes;
    private readonly imageRoutes: ImageRoutes;

    constructor(middlewareFactory: MiddlewareFactory) {
        this.authRoutes = new AuthRoutes(middlewareFactory.getAuthMiddleware());
        this.siteRoutes = new SiteRoutes(middlewareFactory.getSiteMiddleware());
        this.productRoutes = new ProductRoutes(middlewareFactory.getProductMiddleware());
        this.orderRoutes = new OrderRoutes(middlewareFactory.getOrderMiddleware());
        this.imageRoutes = new ImageRoutes(middlewareFactory.getImageMiddleware());
    }

    getAuthRoutes(): AuthRoutes { return this.authRoutes; }
    getSiteRoutes(): SiteRoutes { return this.siteRoutes; }
    getProductRoutes(): ProductRoutes { return this.productRoutes; }
    getOrderRoutes(): OrderRoutes { return this.orderRoutes; }
    getImageRoutes(): ImageRoutes { return this.imageRoutes; }
}