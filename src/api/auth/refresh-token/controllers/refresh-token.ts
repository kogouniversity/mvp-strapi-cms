/**
 * A set of functions called "actions" for `refresh-token`
 */
import jwt from 'jsonwebtoken';

// throws error if refreshToken is expired or not using REFRESH_SECRET from the .env
function verifyRefreshToken(token: string): void {
    jwt.verify(token, process.env.REFRESH_SECRET, {}, err => {
        if (err) {
            throw new Error('Invalid or Expired token.');
        }
    });
}

export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handler(ctx: any) {
        const { user } = ctx.state;
        const { refreshToken } = ctx.request.body;

        try {
            verifyRefreshToken(refreshToken);
        } catch (error) {
            ctx.send(
                {
                    message: error.message,
                },
                400,
            );
        }

        const validRefreshToken = strapi
            .plugin('redis')
            .connections.default.client.get(`user-${user.id}-refresh-token`);
        if (refreshToken !== validRefreshToken) {
            ctx.send(
                {
                    message: 'Invalid Refresh Token.',
                },
                400,
            );
        }

        const newJwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: ctx.state.user.id,
        });
        ctx.send(
            {
                message: 'New Access Token is issued.',
                jwt: newJwt,
            },
            400,
        );
    },
};
