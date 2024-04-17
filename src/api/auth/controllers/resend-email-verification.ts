/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A set of functions called "actions" for `resend-email-verification`
 */

export default {
    async resendEmail(ctx: any): Promise<void> {
        const { id, email } = ctx.state.user;

        if (ctx.state.user.confirmed) {
            return ctx.badRequest('User is already authenticated.');
        }
        const emailVerificationService = strapi.service('plugin::users-permissions.emailVerification');

        const { code, expires } = await emailVerificationService.createEmailVerificationCodeForUser(id);
        const emailToSend = {
            to: email,
            from: '1234@gmail.com',
            subject: 'Thank you for joining Kogo',
            text: code,
        };
        await emailVerificationService.sendVerificationEmail(emailToSend);

        return ctx.send(
            {
                message: `New verification code is sent to ${email}.`,
                expires,
            },
            200,
        );
    },
};
