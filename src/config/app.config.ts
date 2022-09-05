export const EnvConfigutation = () =>({
    enviroment: process.env.NODE_ENV || 'dev',
    mogodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    defaultLimit: +process.env.DEFAULT_LIMIT || 10
});