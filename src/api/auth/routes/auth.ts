export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/local/email-verification',
            handler: 'email-verification.confirmCode',
            config: {
                policies: [],
                middlewares: ['api::auth.validate-email-verification'],
            },
        },
        {
            method: 'POST',
            path: '/auth/local/resend-email-verification',
            handler: 'resend-email-verification.resendEmail',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/local/refresh-token',
            handler: 'refresh-token.handler',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
