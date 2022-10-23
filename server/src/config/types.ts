type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export interface ConfigurationType {
    readonly development: RecursivePartial<DefaultConfig>,
    readonly test: RecursivePartial<DefaultConfig>,
    readonly production: RecursivePartial<DefaultConfig>,
}
export interface ServiceConfig {
    readonly port: number,
    readonly hostname: string,
    readonly protocol: string,
    readonly logType: string
}

export interface RpcConfig {
    readonly queueName: string,
}

export interface DefaultConfig {
    readonly mongodb: string,
    readonly services: {
        readonly [name: string]: ServiceConfig
    },
    readonly rpc: {
        readonly [name: string]: RpcConfig
    },
    readonly crypto: {
        readonly algorithm: string,
        readonly key: string,
        readonly iv: string
    },
    readonly auth: {
        readonly secret: {
            readonly auth: string,
            readonly email: string
        }
        readonly email: {
            readonly type: string,
            readonly email: string,
            readonly password: string
        }
    }
}