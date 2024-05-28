import jwt from 'jsonwebtoken';

async function issueResetPasswordToken(userId: string) {
    if (!userId) throw new Error('user id is undefined.');

    const token = await jwt.sign(
        { id: userId },
        strapi.config.get('application.auth.resetPassword.resetPasswordSecret'),
        {
            expiresIn: strapi.config.get('application.auth.resetPassword.resetPasswordExpiry'),
        },
    );
    return token;
}

// throws error if refreshToken is expired or not using RESET_PASSWORD_SECRET from the .env
function verifyResetPasswordToken(token: string): object {
    try {
        const decode = jwt.verify(token, strapi.config.get('application.auth.resetPassword.resetPasswordSecret'));
        return { success: true, decode };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export default {
    issueResetPasswordToken,
    verifyResetPasswordToken,
};
