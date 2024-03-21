export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/local/refresh-token',
            handler: 'refresh-token.handler',
            config: {
                policies: [],
                middlewares: [],
            },
            auth: false,
        },
    ],
};
