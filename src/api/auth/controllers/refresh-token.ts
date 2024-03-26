/**
 * A set of functions called "actions" for `refresh-token`
 */
function issueJwt(userId: string): string {
    const newJwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: userId,
    });
    return newJwt;
}

export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handler(ctx: any) {
        const { user } = ctx.state;
        const { refreshToken } = ctx.request.body;

        try {
            await strapi.service('plugin::users-permissions.refreshToken').verifyRefreshToken(refreshToken);
            const validToken = await strapi.service('plugin::users-permissions.refreshToken').getRefreshToken(user.id);
            if (refreshToken !== validToken) throw new Error('Refresh token is not matched.');
        } catch (error) {
            if (error.constructor.name === 'ApplicationError' || error.constructor.name === 'Error') {
                return ctx.badRequest(error.message);
            }
            throw error;
        }

        return ctx.send(
            {
                message: 'New Access Token is issued.',
                jwt: issueJwt(ctx.state.user.id),
            },
            200,
        );
    },
};
