module.exports = {
  apps: [
    {
      name: 'ca',
      script: './src/app.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
        MONGODB_URL: 'mongodb://127.0.0.1:27017/caro_online',
        SECRET_KEY: 'notsecret',
      },
    },
  ],
};
