module.exports = ({ env }) => ({
  auth: {
    refresh: {
      refreshSecret: env('REFRESH_SECRET'),
      refreshExpiry: env('REFRESH_TOKEN_EXPIRES')
    }
  }
});
