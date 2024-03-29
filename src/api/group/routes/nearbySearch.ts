export default {
    routes: [
        {
            method: 'POST',
            path: '/groups/nearbySearch',
            handler: 'group.nearbySearch',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
