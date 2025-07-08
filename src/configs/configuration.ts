export const configuration = {
  app: {
    name: process.env.APP_NAME || 'practice nestjs',
    port: parseInt(process.env.APP_PORT || '3001'),
  },
  database: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbUsername: process.env.DB_USERNAME || 'nest',
    dbPort: parseInt(process.env.DB_PORT || '3307'),
    dbPassWord: process.env.DB_PASSWORD || 'nestpass',
    dbDatabase: process.env.DB_DATABASE || 'mydb',
  },
  authentication: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'access_token',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh_token',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  },
};
