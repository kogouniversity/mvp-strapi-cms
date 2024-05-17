module.exports = ({ env }) => ({
  auth: {
    emailVerification: {
      expiry: env('EMAIL_VERIF_CODE_EXPIRES_SEC'),
    },
    refresh: {
      refreshSecret: env('REFRESH_SECRET'),
      refreshExpiry: env('REFRESH_TOKEN_EXPIRES')
    },
    resetPassword: {
      resetPasswordSecret: env('RESET_PASSWORD_SECRET'),
      resetPasswordExpiry: env('RESET_PASSWORD_TOKEN_EXPIRES')
    }
  }
});
