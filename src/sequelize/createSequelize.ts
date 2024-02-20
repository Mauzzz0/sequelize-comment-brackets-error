import { Sequelize } from 'sequelize-typescript';
import { ModelEntity } from '../entities/ModelEntity';

export const createSequelize = async (): Promise<Sequelize> => {
  const cfg = {
    host: 'localhost',
    port: 3120,
    username: 'postgres',
    password: 'postgrespassword',
    database: 'backend',
  };

  const sequelize: Sequelize = new Sequelize({
    dialect: 'postgres',
    replication: {
      write: cfg,
      read: [cfg],
    },
    logging: false,
  });

  sequelize.addModels([ModelEntity]);
  await sequelize.authenticate();
  await sequelize.sync();

  return sequelize;
}