import jwt from 'jsonwebtoken';
import redis from '../../../utils/redis';

async function issueRefeshToken(userId: string) {
    if (!userId) throw new Error('user id is undefined.');

    const token = await jwt.sign({ id: userId }, strapi.config.get('application.auth.refresh.refreshSecret'), {
        expiresIn: strapi.config.get('application.auth.refresh.refreshExpiry'),
    });
    await redis().set(`user-${userId}-refresh-token`, token);
    return token;
}

// throws error if refreshToken is expired or not using REFRESH_SECRET from the .env
function verifyRefreshToken(token: string): void {
    jwt.verify(token, strapi.config.get('application.auth.refresh.refreshSecret'), {}, err => {
        if (err) {
            throw new Error('Invalid or Expired token.');
        }
    });
}

async function getRefreshToken(userId: string) {
    return redis().get(`user-${userId}-refresh-token`);
}

export default {
    issueRefeshToken,
    verifyRefreshToken,
    getRefreshToken,
};
