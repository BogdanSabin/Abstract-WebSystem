import * as cfg from './config';
import { DefaultConfig } from './types';

const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return cfg.config[env.trim()] as DefaultConfig;
}

export const config = getConfig();