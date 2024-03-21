/**
 * A set of functions called "actions" for `refresh-token`
 */
// import jwt from 'jsonwebtoken';

/*
// verify the refreshToken by using the REFRESH_SECRET from the .env
const verifyRefreshToken = (token) => new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_SECRET, {}, (
          err,
          tokenPayload = {}
      ) => {
          if (err) {
              return reject(new Error('Invalid token.'));
          }
          resolve(tokenPayload);
      });
  })

*/
export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler(ctx: any) {
        const newJwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: ctx.state.user.id,
        });
        return { jwt: newJwt };
    },
};
