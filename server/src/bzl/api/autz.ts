import { authorize } from './../lib/autorization/authorize';
import { NextFunction, AutzContext } from '../../types';

export const autzAPI = {
    authorize: (autzData: AutzContext, next: NextFunction) => {
        return authorize(autzData, next);
    }
}