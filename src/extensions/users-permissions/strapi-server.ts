/* eslint-disable no-param-reassign */

import registerOverride from './controllers/registerOverride';
import emailVerificationService from './services/emailVerification';
import refreshTokenService from './services/refrehToken';

export default plugin => {
    plugin.services.emailVerification = emailVerificationService;
    plugin.services.refreshToken = refreshTokenService;

    // extension of register controller
    registerOverride(plugin);

            validateEmail(email);
        } catch (err) {
            strapi.log.error(err.message);
        }

        const entries =
            await strapi.entityService.findMany('api::school.school');
        const schoolDomains = entries.map(e => e.schoolEmailDomain);
        // extract domain from ctx.request.body.email (e.g. jka273@sfu.ca -> sfu.ca)
        const domainString = email.toString().split('@')[1].split('.');
        const emailDomain = domainString[domainString.length - 2].concat(
            '.',
            domainString[domainString.length - 1],
        );

        if (!schoolDomains.includes(emailDomain)) {
            return ctx.badRequest('Not a school domain');
        }

        await register(ctx);

        ctx.response.body.user.confirmed = false;

        await strapi.entityService.update(
            'plugin::users-permissions.user',
            ctx.response.body.user.id,
            {
                data: {
                    confirmed: false,
                },
            },
        );

        const emailToSend = {
            to: ctx.request.body.email,
            from: '1234@gmail.com',
            subject: 'Thank you for joining Kogo',
            text: '111111',
        };

        // Send an email to the user.
        strapi.plugin('email').service('email').send(emailToSend);

        const emailVerification = {
            message: `verification code is sent to ${ctx.request.body.email}`,
            expiry: new Date(Date.now() + 5 * 60 * 1000).toString(),
        };

        const final = {
            ...ctx.response.body,
            emailVerification,
        };

        return ctx.send(final, 200);
    };
    return plugin;
};
