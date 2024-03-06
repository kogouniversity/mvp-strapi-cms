export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/local/resend-email-verification',
            handler: 'resend-email-verification.resendEmail',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
