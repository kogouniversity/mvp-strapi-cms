/* eslint-disable @typescript-eslint/no-explicit-any */
import { validatePassword } from '../../../utils/validateInputs';

export default {
    async sendCodeToResetPassword(ctx: any): Promise<void> {
        const { identifier } = ctx.request.body;

        try {
            const userByEmail = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { email: identifier },
            });
            const userByUsername = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { username: identifier },
            });

            const user = userByEmail ?? userByUsername;

            if (!user) return ctx.badRequest('No such user exists.');

            const emailVerificationService = strapi.service('plugin::users-permissions.emailVerification');

            const { code, expires } = await emailVerificationService.createEmailVerificationCodeForUser(user[0].id);

            const emailToSend = {
                to: user[0].email,
                from: '1234@gmail.com',
                subject: 'Verification code to change your password',
                text: code,
            };
            await emailVerificationService.sendVerificationEmail(emailToSend);

            return ctx.send(
                {
                    message: `New verification code is sent to ${user[0].email}.`,
                    expires,
                    identifier,
                },
                200,
            );
        } catch (error) {
            return ctx.badRequest(error.message);
        }
    },

    async confirmCodeForNewPassword(ctx: any): Promise<void> {
        const { code, identifier } = ctx.request.body;

        const userByEmail = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { email: identifier },
        });
        const userByUsername = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { username: identifier },
        });

        const user = (userByEmail ?? userByUsername)[0];

        const verificationCode = await strapi
            .service('plugin::users-permissions.emailVerification')
            .getEmailVerificationCode(user.id);
        if (!verificationCode) {
            return ctx.badRequest('The verification code is not found, or is expired.');
        }
        if (code.toLowerCase() === verificationCode) {
            try {
                const resetPasswordToken = await strapi
                    .service('plugin::users-permissions.resetPasswordToken')
                    .issueResetPasswordToken(user.id);

                await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                    data: {
                        resetPasswordToken,
                    },
                });

                return ctx.send(
                    {
                        message: 'Code is correct',
                        resetPasswordToken,
                    },
                    200,
                );
            } catch (err) {
                return ctx.badRequest(err.message);
            }
        }
        return ctx.badRequest('Code is incorrect.');
    },

    //
    async setNewPassword(ctx: any): Promise<void> {
        const { newPassword, resetPasswordToken } = ctx.request.body;
        try {
            validatePassword(newPassword);
            const payload = await strapi
                .service('plugin::users-permissions.resetPasswordToken')
                .verifyResetPasswordToken(resetPasswordToken);

            if (!payload.success) {
                return ctx.badRequest('Invalid ResetPasswordToken.');
            }

            const user = await strapi.entityService.update('plugin::users-permissions.user', payload.decode.id, {
                data: {
                    password: newPassword,
                },
            });

            return ctx.send({
                message: 'Password has changed.',
                user,
            });
        } catch (err) {
            return ctx.badRequest(err.message);
        }
    },
};
