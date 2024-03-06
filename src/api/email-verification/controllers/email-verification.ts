/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Context } from 'koa'
/**
 * A set of functions called "actions" for `email-verification`
 */
export default {
    async confirmCode(ctx: any): Promise<void> {
        const { code } = ctx.request.body;
        if (code === '111111') {
            await strapi.entityService.update(
                'plugin::users-permissions.user',
                ctx.state.user.id,
                {
                    data: {
                        confirmed: true,
                    },
                },
            );

            ctx.state.user.confirmed = true;
            ctx.send(ctx.state.user, 200);
        } else {
            ctx.send(
                {
                    message: 'Wrong / Invalid code',
                },
                400,
            );
        }
    },
};
