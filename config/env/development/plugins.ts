// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = ({ env }) => ({
  documentation: {
    enabled: true
  },
  redis: {
    config: {
      connections: {
        default: {
          connection: {
            host: env('REDIS_HOST', 'localhost'),
            port: env('REDIS_PORT', 6379),
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
