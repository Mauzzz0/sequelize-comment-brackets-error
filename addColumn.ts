import { DataType, Sequelize } from 'sequelize-typescript';
import { ModelEntity } from './ModelEntity';
import { createSequelize } from './createSequelize';

export enum StatusEnum {
  active = 'active',
  pending = 'pending',
  available = 'available',
  inactive = 'inactive',
  suspended = 'suspended',
}

export const addColumn = async (comment: string) => {
  const sequelize = await createSequelize();
  const qi = sequelize.getQueryInterface();
  const transaction = await qi.sequelize.transaction();

  let success = false;
  try {
    await qi.addColumn(
      ModelEntity.tableName,
      'status',
      {
        type: DataType.ENUM,
        allowNull: false,
        values: Object.values(StatusEnum),
        defaultValue: StatusEnum.available,
        comment,
      },
      {transaction},
    );
    await transaction.commit();
    console.log('Column successfully created!')
    success = true;
  }
  catch(e: any){
    console.error('Error:')
    console.error(e.message);
    console.error(e.sql)
    await transaction.rollback();
    console.log('Successfully rollbacked!')
  }

  if (success) await removeStatusColumn(sequelize);
}

export const removeStatusColumn = async (sequelize: Sequelize) => {
  await sequelize.getQueryInterface().removeColumn(      ModelEntity.tableName, 'status');
  await sequelize.query('drop type "enum_Model_status"')
  console.log('Column successfully removed!')
}
