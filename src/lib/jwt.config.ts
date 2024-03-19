export const accessTokenConfig = {
  expiresIn: '60min',
  secret: process.env.ACCESS_TOKEN_SECRET_KEY,
};

export const refreshTokenConfig = {
  expiresIn: '7d',
  secret: process.env.REFRESH_TOKEN_SECRET_KEY,
};
