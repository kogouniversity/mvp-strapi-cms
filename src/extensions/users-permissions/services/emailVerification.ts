import { generateRandomString } from '../../../utils/generateString';
import redis from '../../../utils/redis';

async function createEmailVerificationCodeForUser(userId: string) {
    if (!userId) throw new Error('user id is undefined.');
    const randomString = generateRandomString(6);
    const expires = parseInt(strapi.config.get('application.auth.refresh.refreshExpiry'), 10);
    await redis().set(`usr-${userId}-email-verification-codes`, randomString);
    await redis().expire(`usr-${userId}-email-verification-codes`, expires);
    return {
        code: randomString.toUpperCase(),
        expires,
    };
}

async function getEmailVerificationCode(userId: string) {
    if (!userId) throw new Error('user id is undefined.');
    const code = await redis().get(`usr-${userId}-email-verification-codes`);
    return code;
}

/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Email = {
    to: string;
    from: string;
    subject: string;
    text: string;
};
async function sendVerificationEmail(email: Email) {
    // Send an email to the user.
    strapi.plugin('email').service('email').send(email);
}

export default {
    createEmailVerificationCodeForUser,
    getEmailVerificationCode,
    sendVerificationEmail,
};
