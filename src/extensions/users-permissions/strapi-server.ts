/* eslint-disable no-param-reassign */
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

        return ctx.send(ctx.response.body);
    };
    return plugin;
};
