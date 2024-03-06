/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A set of functions called "actions" for `resend-email-verification`
 */

export default {
    async resendEmail(ctx: any): Promise<void> {
        const { email } = ctx.request.body;

        if (ctx.state.user.confirmed) {
            ctx.send(
                {
                    message: 'Already confirmed user',
                },
                400,
            );
        } else {
            const emailToSend = {
                to: ctx.request.body.email,
                from: '1234@gmail.com',
                subject: 'Here is your re-verification email code',
                text: '111111',
            };

            // Send an email to the user.
            strapi.plugin('email').service('email').send(emailToSend);

            const final = {
                message: `verification code is sent to ${email}`,
                expiry: new Date(Date.now() + 5 * 60 * 1000).toString(),
            };
            ctx.send(final, 200);
        }
    },
};
