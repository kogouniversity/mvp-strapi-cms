export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/local/email-verification',
            handler: 'email-verification.sendEmail',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
