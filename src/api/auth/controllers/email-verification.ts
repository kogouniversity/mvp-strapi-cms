/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * A set of functions called "actions" for `email-verification`
 */
export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async confirmCode(ctx: any): Promise<void> {
        const code = ctx.request.body.code.toLowerCase();
        const verificationCode = await strapi
            .service('plugin::users-permissions.emailVerification')
            .getEmailVerificationCode(ctx.state.user.id);

        if (!verificationCode) {
            return ctx.badRequest('The verification code is not found, or is expired.');
        }

        if (code === verificationCode) {
            const authenticatedRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
                filters: { type: 'Authenticated' },
            });
            const user = await strapi.entityService.update('plugin::users-permissions.user', ctx.state.user.id, {
                data: {
                    confirmed: true,
                    role: authenticatedRole[0].id,
                },
            });

            return ctx.send(
                {
                    message: 'User is authenticated',
                    user,
                },
                200,
            );
        }
        return ctx.badRequest('The verification code is not matched.');
    },
};
