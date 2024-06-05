/**
 * group router
 */
/**
 * group router
 */
import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::group.group');

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes);
            return routes;
        },
    };
};

const myExtraRoutes = [
    {
        method: 'POST',
        path: '/groups/nearbySearch',
        handler: 'group.nearbySearch',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'POST',
        path: '/groups/:id/profilePhoto',
        handler: 'group.uploadProfilePhoto',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'GET',
        path: '/following',
        handler: 'group.following',
        config: {
            policies: [],
            middlewares: [],
        },
    },
];

export default customRouter(defaultRouter, myExtraRoutes);
