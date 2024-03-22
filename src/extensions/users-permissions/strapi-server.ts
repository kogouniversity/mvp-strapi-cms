import jwt from 'jsonwebtoken';

/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendVerificationEmail(ctx: any) {
    const emailToSend = {
        to: ctx.request.body.email,
        from: '1234@gmail.com',
        subject: 'Thank you for joining Kogo',
        text: '111111',
    };

    // Send an email to the user.
    strapi.plugin('email').service('email').send(emailToSend);
}

// issue a Refresh token
const issueRefeshToken = (payload: object) =>
    jwt.sign(JSON.stringify(payload), process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    });

export default plugin => {
    // the default register controller
    const { register } = plugin.controllers.auth;

    // extension of register controller
    plugin.controllers.auth.register = async ctx => {
        // check if school domain is valid
        const { email } = ctx.request.body;
        try {
            const validateEmail = (emailToValidate: string) =>
                String(emailToValidate)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    );
            validateEmail(email);
        } catch (err) {
            return ctx.badRequest('Bad email address');
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
            return ctx.badRequest('Not a registered school domain');
        }

        await register(ctx);

        const { user } = ctx.response.body;

        await strapi.entityService.update(
            'plugin::users-permissions.user',
            user.id,
            {
                data: {
                    confirmed: false,
                },
            },
        );

        sendVerificationEmail(ctx);

        const emailVerification = {
            message: `verification code is sent to ${ctx.request.body.email}`,
            expiry: new Date(Date.now() + 5 * 60 * 1000).toString(),
        };

        const refreshToken = issueRefeshToken({ id: user.id });
        strapi
            .plugin('redis')
            .connections.default.client.set(
                `user-${user.id}-refresh-token`,
                refreshToken,
            );

        return ctx.send(
            {
                ...ctx.response.body,
                emailVerification,
                refreshToken,
            },
            200,
        );
    };
    return plugin;
};
