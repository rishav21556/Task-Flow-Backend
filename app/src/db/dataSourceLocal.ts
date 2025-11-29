import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

let connectionOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "db-name",
  synchronize: true,
  logging: false,
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/db/migrations/*{.ts,.js}"],
};

export default new DataSource({
  ...connectionOptions,
});