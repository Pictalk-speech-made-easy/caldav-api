import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
const dbConfig_MYSQL = config.get('db_MYSQL');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig_MYSQL.type,
    entities: [],
    host: process.env.MYSQL_URL || dbConfig_MYSQL.host,
    port: process.env.DB_PORT || dbConfig_MYSQL.port,
    username: process.env.MYSQL_USERNAME || dbConfig_MYSQL.username,
    password: process.env.MYSQL_PASSWORD || dbConfig_MYSQL.password,
    database: process.env.MYSQL_DB || dbConfig_MYSQL.database,
    synchronize: process.env.TYPEORM_SYNC || dbConfig_MYSQL.synchronize,
};