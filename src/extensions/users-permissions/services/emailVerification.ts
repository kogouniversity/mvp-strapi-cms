import { generateRandomString } from '../../../utils/generateString';
import redis from '../../../utils/redis';

async function createEmailVerificationCodeForUser(userId: string) {
    if (!userId) throw new Error('user id is undefined.');
    const randomString = generateRandomString(6);
    await redis().set(`usr-${userId}-email-verification-codes`, randomString);
    return randomString.toUpperCase();
}

async function getEmailVerificationCode(userId: string) {
    if (!userId) throw new Error('user id is undefined.');
    const code = await redis().get(`usr-${userId}-email-verification-codes`);
    return code;
}

/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendVerificationEmail(userId: string, email: string) {
    const code = await createEmailVerificationCodeForUser(userId);
    const emailToSend = {
        to: email,
        from: '1234@gmail.com',
        subject: 'Thank you for joining Kogo',
        text: code,
    };

    // Send an email to the user.
    strapi.plugin('email').service('email').send(emailToSend);
}

export default {
    createEmailVerificationCodeForUser,
    getEmailVerificationCode,
    sendVerificationEmail,
};
