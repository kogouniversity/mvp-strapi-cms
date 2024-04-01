import { ZodError, z } from 'zod';
import emailVerificationService from '../services/emailVerification';
import refreshTokenService from '../services/refrehToken';

function validateEmailFormat(email: string): void {
    const validateEmail = (emailToValidate: string) =>
        String(emailToValidate)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    if (!validateEmail(email)) throw new Error('Invalid email format.');
}

async function validateEmailDomain(email: string) {
    const entries = await strapi.entityService.findMany('api::school.school');
    const schoolDomains = entries.map(e => e.schoolEmailDomain);

    // extract domain from ctx.request.body.email (e.g. jka273@sfu.ca -> sfu.ca)
    const domainString = email.toString().split('@')[1].split('.');
    const emailDomain = domainString[domainString.length - 2].concat('.', domainString[domainString.length - 1]);

    if (!schoolDomains.includes(emailDomain)) throw new Error('Given email is not a registered school domain.');
}

function validateUsername(username: string) {
    try {
        z.string()
            .refine(s => s.length >= 6 && s.length <= 15, 'Username must be between 6 to 15 characters.')
            .parse(username);
        z.string()
            .refine(s => !s.includes(' '), 'Username must not contain a whitespace.')
            .parse(username);
        z.string()
            .refine(s => /^[a-zA-Z0-9]{6,15}$/.test(s), 'Username must not contain a special character.')
            .parse(username);
    } catch (err) {
        throw new Error((err as ZodError).issues[0].message);
    }
}

function validatePassword(password: string) {
    try {
        z.string().min(8, 'Password must be at least 8 characters.').parse(password);
        z.string()
            .refine(s => !s.includes(' '), 'Password must not include a whitespace.')
            .parse(password);
        z.string()
            .refine(
                s => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(s),
                'Password must contain one uppercase letter, one number, and one special character.',
            )
            .parse(password);
    } catch (err) {
        throw new Error((err as ZodError).issues[0].message);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default function registerOverride(register: (ctx: any) => Promise<any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    return async (ctx: any) => {
        const { username, password, email } = ctx.request.body;
        try {
            validateUsername(username);
            validatePassword(password);
            validateEmailFormat(email);
            await validateEmailDomain(email);
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
                    message: `verification code is sent to ${email}`,
                },
            },
            200,
        );
    };
}
