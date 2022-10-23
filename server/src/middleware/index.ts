import { CoreBzlRpcClient } from './../clients/coreBzlClient';
import { AuthMiddleware } from './AuthMiddleware';

export class MiddlewareFactory {
    private readonly authMiddleware: AuthMiddleware;

    constructor(coreBzlRpcClient: CoreBzlRpcClient) {
        this.authMiddleware = new AuthMiddleware(coreBzlRpcClient);
    }

    getAuthMiddleware(): AuthMiddleware { return this.authMiddleware; }
}