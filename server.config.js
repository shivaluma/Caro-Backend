module.exports = {
  apps: [
    {
      name: 'Server API',
      script: './src/app.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: '5000',
        MONGODB_URL: 'mongodb://127.0.0.1:27017/sprint_restrospective',
        SECRET_KEY: 'notsecret',
      },
    },
  ],
};
