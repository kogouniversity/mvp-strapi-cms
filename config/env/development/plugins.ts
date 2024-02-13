// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'localhost',
        port: 10250,
        ignoreTLS: true,
      },
    },
  },
  maildev: {
    enabled: true,
    resolve: './plugins/maildev'
  },
});
