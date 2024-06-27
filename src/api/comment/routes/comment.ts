/**
 * comment router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::comment.comment');

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) {
                routes = [
                    {
                        method: 'POST',
                        path: '/comment/:commentId/like',
                        handler: 'comment.like',
                        config: {
                            policies: [],
                            middlewares: [],
                        },
                    },
                    {
                        method: 'DELETE',
                        path: '/comment/:commentId/like',
                        handler: 'comment.removeLike',
                        config: {
                            policies: [],
                            middlewares: [],
                        },
                    },
                    ...innerRouter.routes.concat(extraRoutes),
                ];
            }
            return routes;
        },
    };
};

const myExtraRoutes = [];

export default customRouter(defaultRouter, myExtraRoutes);
