/**
 * post router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::post.post');

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
                        method: 'GET',
                        path: '/posts/schoolPosts',
                        handler: 'post.schoolPosts',
                        config: {
                            policies: [],
                            middlewares: [],
                        },
                    },
                    {
                        method: 'GET',
                        path: '/posts/allPosts',
                        handler: 'post.allPosts',
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
