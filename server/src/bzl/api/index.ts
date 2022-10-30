import { siteAPI } from './site';
import { authAPI } from './authentication';
import { autzAPI } from './autz';
import { productAPI } from './product';
import { orderAPI } from './order';
import { imageAPI } from './image';

export const registrarAPI = {
    auth: authAPI,
    autz: autzAPI,
    site: siteAPI,
    product: productAPI,
    order: orderAPI,
    image: imageAPI
}