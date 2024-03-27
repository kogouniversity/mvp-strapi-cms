/**
 * group router
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/group/nearbySearch',
            handler: 'group.nearbySearch',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
