import * as dotenv from 'dotenv'
dotenv.config();


const envConfig = {
    PASS_CODE: process.env.appPassword,
    SECRET_KEY: process.env.secretKey,
    DB_URL: process.env.dbUrl,
    EMAIL_USER: process.env.emailUser,
    EMAIL_HOST: process.env.emailHost,
    EMAIL_PORT: process.env.emailPort,

}

export default envConfig;
