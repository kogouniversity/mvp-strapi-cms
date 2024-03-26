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

        await strapi.service('plugin::users-permissions.emailVerification').sendVerificationEmail(id, email);

        return ctx.send(
            {
                message: `New verification code is sent to ${email}.`,
            },
            200,
        );
    },
};
