/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
    async sendCodeToResetPassword(ctx: any): Promise<void> {
        const { email } = ctx.request.body;
        return ctx.send(
            {
                message: email,
            },
            200,
        );
        try {
            const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { email },
            });
            console.log(user);
        } catch (error) {
            return ctx.badRequest(error.message);
        }

        const emailVerificationService = strapi.service('plugin::users-permissions.emailVerification');
        const { code, expires } = await emailVerificationService.createEmailVerificationCodeForUser(id);
        const emailToSend = {
            to: email,
            from: '1234@gmail.com',
            subject: 'Verification code to change your password',
            text: code,
        };
        await emailVerificationService.sendVerificationEmail(emailToSend);
        // store the code
        return ctx.send(
            {
                message: `New verification code is sent to ${email}.`,
                expires,
            },
            200,
        );
    },
};
