module.exports = {
  apps: [
    {
      name: 'kogo-cms', // Your project name
      cwd: '', // Path to your project
      script: 'npm', // For this example we're using npm, could also be yarn
      args: 'start', // Script to start the Strapi server, `start` by default
      env: {
	      NODE_ENV: 'development',
        APP_KEYS: '', // you can find it in your project .env file.
        API_TOKEN_SALT: '',
        ADMIN_JWT_SECRET: '',
        JWT_SECRET: '',
        DATABASE_CLIENT: '',
        DATABASE_HOST: '', // database Endpoint u>
        DATABASE_PORT: '',
        DATABASE_NAME: '', // DB name under 'Configuration' tab
        DATABASE_USERNAME: '', // default username
        DATABASE_PASSWORD: '',
        UPLOAD_PRIVDER: 'aws-s3',
        AWS_ACCESS_KEY_ID: '',
        AWS_ACCESS_SECRET: '', // Find it in Amazon S3 Dashboard
        AWS_REGION: '',
        AWS_BUCKET_NAME: '',
      },
    }
  ],
}
