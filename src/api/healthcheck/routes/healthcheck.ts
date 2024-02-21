import { Context } from 'koa';

export default {
    routes: [
        {
            method: 'GET',
            path: '/healthcheck',
            async handler(ctx: Context): Promise<void> {
                try {
                    ctx.body = 'ok';
                } catch (error) {
                    ctx.body = error;
                }
            },
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
