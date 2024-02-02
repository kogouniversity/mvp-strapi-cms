module.exports = ({ env }) => ({
  upload: {
    enabled: env('AWS_S3_ENABLED', false),
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: {
        s3Options: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET_NAME'),
          },
        }
      },
      // These parameters could solve issues with ACL public-read access — see [this issue](https://github.com/strapi/strapi/issues/5868) for details
      actionOptions: {
        upload: {
          ACL: null
        },
        uploadStream: {
          ACL: null
        },
      },
      'users-permissions': {
        config: {
          jwt: {
            expiresIn: '7d',
          },
          // If you have added any additional fields to your user model that need to be accepted on registration
          register: {
            allowedFields: [],
          }
        },
      },
    },
  }
});
