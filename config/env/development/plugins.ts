// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = ({ env }) => ({
  redis: {
    config: {
      connections: {
        default: {
          connection: {
            host: '127.0.0.1',
            port: 6379,
            db: 0,
          },
          settings: {
            debug: true,
          },
        },
      },
    },
  },
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
