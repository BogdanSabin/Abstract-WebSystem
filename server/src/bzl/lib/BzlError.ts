export interface BzlErrorResponse {
    readonly code: number,
    readonly message: string
}

export class BzlError {
    static NodataFound(error?: string): BzlErrorResponse {
        return {
            code: 404,
            message: error ? `No data Found:${error}` : 'No data Found'
        }
    }

    static Forbidden(error?: string): BzlErrorResponse {
        return {
            code: 403,
            message: error ? `Forbidden:${error}` : 'Forbidden'
        }
    }

    static Collision(error?: string): BzlErrorResponse {
        return {
            code: 401,
            message: error ? `Collsion of fields in database ${error}` : 'Collsion of fields in database'
        }
    }

    static Unauthorized(error?: string): BzlErrorResponse {
        return {
            code: 401,
            message: error ? `Unauthorized ${error}` : 'Unauthorized'
        }
    }

    static UnauthorizedError(error: string): BzlErrorResponse {
        return {
            code: 401,
            message: 'Unauthorized: ' + error
        }
    }

    static InteralError(error: string): BzlErrorResponse {
        return {
            code: 500,
            message: error
        }
    }

    static InvalidArgument(error: string): BzlErrorResponse {
        return {
            code: 500,
            message: 'Invalid argument: ' + error
        }
    }
}