import emailVerificationService from '../services/emailVerification';
import refreshTokenService from '../services/refrehToken';

function validateEmailFormat(email: string): void {
    const validateEmail = (emailToValidate: string) =>
        String(emailToValidate)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    if (!validateEmail(email)) throw new Error('Bad email format.');
}

async function validateEmailDomain(email: string) {
    const entries = await strapi.entityService.findMany('api::school.school');
    const schoolDomains = entries.map(e => e.schoolEmailDomain);

    // extract domain from ctx.request.body.email (e.g. jka273@sfu.ca -> sfu.ca)
    const domainString = email.toString().split('@')[1].split('.');
    const emailDomain = domainString[domainString.length - 2].concat('.', domainString[domainString.length - 1]);

    if (!schoolDomains.includes(emailDomain)) {
        throw new Error('Not a registered school domain');
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default function registerOverride(plugin: any) {
    const { register } = plugin.controllers.auth;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    plugin.controllers.auth.register = async (ctx: any) => {
        const { email } = ctx.request.body;
        try {
            validateEmailFormat(email);
            validateEmailDomain(email);
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        try {
            await register(ctx);
        } catch (error) {
            if (error.constructor.name === 'ApplicationError') {
                return ctx.badRequest(error.message);
            }
        }

        const unauthenticatedRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
            filters: { type: 'Unauthenticated' },
        });
        const user = await strapi.entityService.update('plugin::users-permissions.user', ctx.response.body.user.id, {
            data: {
                confirmed: false,
                role: unauthenticatedRole[0].id,
            },
        });

        emailVerificationService.sendVerificationEmail(user.id as string, email);
        const refreshToken = await refreshTokenService.issueRefeshToken(user.id as string);

        return ctx.send(
            {
                ...ctx.response.body,
                user,
                refreshToken,
                emailVerification: {
                    message: `verification code is sent to ${ctx.request.body.email}`,
                },
            },
            200,
        );
    };
}
