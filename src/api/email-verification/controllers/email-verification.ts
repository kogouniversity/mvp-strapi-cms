/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Context } from 'koa'
/**
 * A set of functions called "actions" for `email-verification`
 */
export default {
    async sendEmail(ctx: any): Promise<void> {
        const c = await strapi.entityService.update(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                data: {
                    id: ctx.request.body.id,
                },
            },
        );
        if (c.confirmed) {
            ctx.badRequest('Already confirmed user');
        } else {
            const emailToSend = {
                to: ctx.request.body.email,
                from: '1234@gmail.com',
                subject: 'Thank you for joining Kogo',
                text: '111111',
            };

            // Send an email to the user.
            strapi.plugin('email').service('email').send(emailToSend);

            ctx.body = 'ok';
        }
    },
};
