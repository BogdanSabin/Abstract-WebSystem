export const registry = {
    admin: {
        site: {
            create: true,
            update: true,
            findById: true,
            queryAll: true,
            delete: true,
            analytics: true
        },
        product: {
            create: true,
            update: true,
            findById: true,
            queryAll: true,
            delete: true
        },
        order: {
            create: true,
            update: true,
            findById: true,
            queryAll: true,
            delete: true
        },
        image: {
            upload: true,
            findByRef: true,
            delete: true,
        }
    },
    user: {
        site: {
            create: false,
            update: false,
            findById: true,
            queryAll: false,
            delete: false,
            analytics: false
        },
        product: {
            create: false,
            update: false,
            findById: true,
            queryAll: true,
            delete: false
        },
        order: {
            create: true,
            update: false,
            findById: true,
            queryAll: true,
            delete: false
        },
        image: {
            upload: false,
            findByRef: true,
            delete: false,
        }
    }
}